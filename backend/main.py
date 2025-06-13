# main.py (Versión Final del Módulo 2 - Integración con Gemini)

import json
import os
from fastapi import FastAPI
from pydantic import BaseModel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# --- 1. Carga de Variables de Entorno y Configuración de Gemini ---
load_dotenv()

import google.generativeai as genai

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("No se encontró la API Key de Gemini. Asegúrate de que tu archivo .env está configurado.")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash') # Usamos el modelo más reciente y rápido

# --- Carga y Preparación de Datos (Corpus para el buscador inicial) ---
with open('knowledge_base.json', 'r', encoding='utf-8') as f:
    knowledge_base = json.load(f)

# (La creación del corpus sigue igual, ya que lo usamos para la fase de Recuperación)
corpus = []
# ... [Pega aquí todo el código de creación del corpus de la versión anterior] ...
for exp in knowledge_base['experience']:
    position_title = exp.get('position', '')
    company = exp.get('company', '')
    responsibilities = ' '.join(exp.get('responsibilities', []))
    doc = f"Mi experiencia como {position_title} en {company}. Mis responsabilidades incluían: {responsibilities}."
    corpus.append(doc)
for edu in knowledge_base['education']:
    degree = edu.get('degree', '')
    institution = edu.get('institution', '')
    doc = f"Sobre mi formación: obtuve el título o certificado de {degree} en {institution}."
    corpus.append(doc)
all_courses = ', '.join(knowledge_base.get('courses', []))
corpus.append(f"He realizado varios cursos para mantenerme actualizado, como por ejemplo: {all_courses}.")
all_achievements = ', '.join(knowledge_base.get('professional_achievements', []))
corpus.append(f"Algunos de mis logros profesionales incluyen mi participación en los planes de desarrollo municipal (PDM) como: {all_achievements}.")
corpus.append(f"Un resumen sobre mi perfil profesional: {knowledge_base.get('professional_profile', '')}")


# --- Vectorización del Corpus (Para la fase de Recuperación) ---
vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(corpus)

# --- Configuración de la Aplicación FastAPI ---
app = FastAPI()
# (El código de CORS sigue igual)
origins = ["http://localhost:5173", "http://127.0.0.1:5173", "https://portafolio-inteligente.vercel.app"]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

class Query(BaseModel):
    text: str

# --- NUEVA CLASE PARA EL PROJECT MATCHMAKER ---
class ProjectQuery(BaseModel):
    description: str

# --- ENDPOINT /ask ACTUALIZADO CON LÓGICA RAG Y GEMINI ---
@app.post("/ask")
def ask_question(query: Query):
    # 1. RECUPERACIÓN (Retrieval): Usamos nuestro viejo modelo para encontrar el contexto más relevante.
    query_vector = vectorizer.transform([query.text])
    cosine_similarities = cosine_similarity(query_vector, tfidf_matrix).flatten()
    
    # Obtenemos los índices de los 3 documentos más relevantes
    top_3_indices = cosine_similarities.argsort()[-3:][::-1]
    
    # Creamos el contexto con la información de esos 3 documentos
    context = " ".join([corpus[i] for i in top_3_indices if cosine_similarities[i] > 0.1])
    
    if not context:
        context = "No se encontró información relevante en el CV."

    # 2. GENERACIÓN (Generation): Creamos el prompt y llamamos a Gemini.
    prompt = f"""
    Actúa como un asistente de IA llamado Ivan Andres Zuñiga Romo. Tu tono es profesional, servicial y seguro.
    Usando ESTRICTAMENTE la siguiente información de contexto, responde la pregunta del usuario de forma natural y en primera persona.
    Si la pregunta es sobre un tema no incluido en el contexto (como gastronomía, derecho, deportes, etc.), amablemente indica que ese tema está fuera de tu área de especialización y que te enfocas en tecnología, IA y gestión de proyectos. No inventes información.

    ---
    CONTEXTO:
    {context}
    ---
    PREGUNTA DEL USUARIO:
    {query.text}
    """
    
    try:
        response = model.generate_content(prompt)
        return {"answer": response.text}
    except Exception as e:
        print(f"Error al llamar a la API de Gemini: {e}")
        return {"answer": "Lo siento, estoy teniendo problemas para conectarme con mi cerebro de IA en este momento. Por favor, intenta de nuevo más tarde."}

# --- El resto de los endpoints GET siguen igual ---
# ... [Pega aquí todos tus endpoints GET (/profile, /experience, etc.)] ...
@app.get("/profile")
def get_profile():
    return {
        "personalInfo": knowledge_base.get("personal_info", {}),
        "professionalProfile": knowledge_base.get("professional_profile", "")
    }
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
    return {
        "academic_distinctions": knowledge_base.get("academic_distinctions", []),
        "professional_achievements": knowledge_base.get("professional_achievements", [])
    }

# main.py (al final, antes de nada más)

@app.post("/match-project")
def match_project_to_cv(query: ProjectQuery):
    # Convertimos todo el CV en un gran bloque de texto para darle contexto a la IA
    cv_context = json.dumps(knowledge_base, indent=2, ensure_ascii=False)

    client_description = query.description

    # El prompt es la instrucción detallada para Gemini
    prompt = f"""
    Actúa como un consultor de estrategia tecnológica experto llamado Ivan. Tu tarea es analizar la descripción de un proyecto de un cliente potencial y compararla con tu propio currículum para generar un análisis de por qué eres el candidato ideal. Tu tono debe ser profesional, seguro y orientado a soluciones.

    **Instrucciones de Formato OBLIGATORIAS:**
    - Usa '###' antes de cada subtítulo. Por ejemplo: '### Habilidades Relevantes'.
    - Usa un guion seguido de un espacio ('- ') para cada elemento de una lista.
    - Usa saltos de línea para separar párrafos.

    **Contenido de la Respuesta:**
    1. Empieza con un subtítulo '### Entendimiento del Proyecto'. Resume tu entendimiento del proyecto del cliente.
    2. Continúa con un subtítulo '### Habilidades y Experiencia Relevantes'. Crea una lista con 3 a 5 de tus habilidades o experiencias más relevantes del currículum que aplican directamente al proyecto.
    3. Finaliza con un subtítulo '### Mi Propuesta de Valor'. Escribe un párrafo explicando por qué tu combinación única de experiencia te convierte en el socio perfecto.

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
        print(f"Error al llamar a la API de Gemini para el matchmaker: {e}")
        return {"analysis": "Lo siento, ocurrió un error al analizar el proyecto. Por favor, intenta de nuevo."}