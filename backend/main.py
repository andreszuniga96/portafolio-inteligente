# main.py (Versión Final Definitiva)

# --- 1. IMPORTACIONES ---
import json
import os
from fastapi import FastAPI
from pydantic import BaseModel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import google.generativeai as genai

# --- 2. CONFIGURACIÓN INICIAL ---
load_dotenv()

# Configuración de la API de Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("No se encontró la API Key de Gemini. Asegúrate de que tu archivo .env está configurado.")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

# Carga de la base de conocimiento desde el archivo JSON
with open('knowledge_base.json', 'r', encoding='utf-8') as f:
    knowledge_base = json.load(f)

# --- 3. CREACIÓN DE CORPUS PARA EL CHATBOT RÁPIDO ---
# Este corpus es solo para la búsqueda inicial de contexto del chatbot general.
corpus = []
for exp in knowledge_base.get('experience', []):
    doc = f"Experiencia como {exp.get('position', '')} en {exp.get('company', '')}. Responsabilidades: {' '.join(exp.get('responsibilities', []))}"
    corpus.append(doc)

for edu in knowledge_base.get('education', []):
    doc = f"Formación académica: {edu.get('degree', '')} en {edu.get('institution', '')}."
    corpus.append(doc)

corpus.append(f"Resumen profesional: {knowledge_base.get('professional_profile', '')}")

vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(corpus)

# --- 4. INICIALIZACIÓN DE FASTAPI Y CORS ---
app = FastAPI()
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://portafolio-inteligente.vercel.app", # Tu URL de producción
    "https://iazr-cv.vercel.app"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 5. MODELOS DE DATOS (PYDANTIC) ---
class Query(BaseModel):
    text: str

class ProjectQuery(BaseModel):
    description: str

# --- 6. ENDPOINTS DE LA API ---

# Endpoint Raíz
@app.get("/")
def read_root():
    return {"status": "API del Portafolio Inteligente en línea"}

# Endpoints para servir datos al Frontend
@app.get("/profile")
def get_profile():
    return {"personal_info": knowledge_base.get("personal_info", {}), "professionalProfile": knowledge_base.get("professional_profile", "")}

@app.get("/experience")
def get_experience():
    return {"experience": knowledge_base.get("experience", [])}

@app.get("/education")
def get_education():
    return {"education": knowledge_base.get("education", [])}

@app.get("/skills")
def get_skills():
    return {"skills": knowledge_base.get("skills", [])}

@app.get("/courses")
def get_courses():
    return {"courses": knowledge_base.get("courses", [])}

@app.get("/achievements")
def get_achievements():
    return {"academic_distinctions": knowledge_base.get("academic_distinctions", []), "professional_achievements": knowledge_base.get("professional_achievements", [])}


# Endpoint para el Chatbot General (Q&A rápido)
@app.post("/ask")
def ask_question(query: Query):
    query_vector = vectorizer.transform([query.text])
    cosine_similarities = cosine_similarity(query_vector, tfidf_matrix).flatten()
    top_3_indices = cosine_similarities.argsort()[-3:][::-1]
    context = " ".join([corpus[i] for i in top_3_indices if cosine_similarities[i] > 0.1])
    if not context:
        context = "No se encontró información relevante en el CV para esta pregunta."

    prompt = f"""Actúa como un asistente de IA llamado Ivan. Usando ESTRICTAMENTE el siguiente contexto, responde la pregunta del usuario de forma breve y directa. Si la pregunta es sobre un tema no incluido en el contexto (como gastronomía, derecho, etc.), amablemente indica que ese tema está fuera de tu área de especialización y que te enfocas en tecnología, IA y gestión de proyectos. Contexto: {context}. Pregunta del usuario: {query.text}"""
    
    try:
        response = model.generate_content(prompt)
        return {"answer": response.text}
    except Exception as e:
        print(f"Error en /ask: {e}")
        return {"answer": "Lo siento, estoy teniendo un problema técnico para responder."}


# Endpoint para el "Project Matchmaker" (Análisis de Proyectos)
@app.post("/match-project")
def match_project_to_cv(query: ProjectQuery):
    cv_context = json.dumps(knowledge_base, indent=2, ensure_ascii=False)
    client_description = query.description
    
    prompt = f"""
    Actúa como un consultor de estrategia tecnológica experto llamado Ivan. Tu tarea es analizar la descripción de un proyecto de un cliente potencial y compararla con tu propio currículum para generar un análisis estratégico y una propuesta de valor. Tu tono debe ser profesional, seguro y orientado a soluciones.

    **Instrucciones de Formato OBLIGATORIAS:**
    - **No incluyas un título principal como 'Análisis Personalizado'.** Empieza directamente con el primer subtítulo.
    - Usa '###' para los subtítulos principales (Análisis, Propuesta, Estimación).
    - Usa '**' para encerrar sub-encabezados dentro de una sección. Por ejemplo: **Objetivos de Negocio**.
    - **Para las fases de la propuesta, usa obligatoriamente un guion y un espacio ('- ') al inicio de cada fase.** Por ejemplo: "- **Fase 1: Discovery y Estrategia.**"

    **Contenido de la Respuesta (sigue esta estructura al pie de la letra):**

    ### Análisis Profundo del Proyecto
    (Realiza un análisis macro y micro. Desglosa la idea en: **Objetivos de Negocio**, **Requerimientos Técnicos Potenciales**, etc.)

    ### Propuesta de Valor
    (Diseña una ruta de implementación en 3 fases, cada una iniciando con '- '.)

    ### Estimación de Inversión
    (Proporciona una estimación de rango **competitiva para un desarrollador freelance en el mercado colombiano** en Pesos Colombianos (COP). Justifica el rango basado en la complejidad. Usa rangos realistas y accesibles. Por ejemplo: para una tienda online básica, un rango podría ser '$2.500.000 - $4.500.000 COP'. Para una plataforma con IA, podría empezar en '$8.000.000 COP'. Aclara siempre que es una estimación inicial.)

    ---
    MI CURRÍCULUM COMPLETO (Contexto):
    {cv_context}
    ---
    DESCRIPCIÓN DEL PROYECTO DEL CLIENTE:
    {client_description}
    """

    try:
        response = model.generate_content(prompt)
        return {"analysis": response.text}
    except Exception as e:
        print(f"Error en /match-project: {e}")
        return {"analysis": "Lo siento, ocurrió un error al analizar el proyecto. Por favor, intenta de nuevo."}