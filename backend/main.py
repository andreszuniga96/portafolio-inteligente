# main.py (Versión Final de la Fase 2)

import json
from fastapi import FastAPI
from pydantic import BaseModel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# --- Importación para CORS ---
from fastapi.middleware.cors import CORSMiddleware

# --- Inicio de la Aplicación FastAPI ---
app = FastAPI()

# --- Configuración de CORS ---
# Orígenes permitidos (en nuestro caso, la dirección del front-end de React)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://portafolio-inteligente.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Permite todos los métodos (GET, POST, etc.)
    allow_headers=["*"], # Permite todas las cabeceras
)


# --- Carga y Preparación de Datos (Nuestro Corpus) v3.1 ---
# ... (El código de carga del JSON va aquí) ...
with open('knowledge_base.json', 'r', encoding='utf-8') as f:
    knowledge_base = json.load(f)

corpus = []
# ... (El loop de workExperience va aquí, sin cambios) ...
for exp in knowledge_base['workExperience']:
    role_title = exp['role']
    technologies = ' '.join(exp['technologiesUsed'])
    doc = f"Mi experiencia como {role_title}. El rol trataba sobre {role_title}. {exp['description']} Algunas funciones clave fueron {' '.join(exp['keyFunctions'])}. Las tecnologías que usé en este rol incluyen: {technologies}."
    corpus.append(doc)
# ... (El loop de education va aquí, sin cambios) ...
for edu in knowledge_base['education']:
    doc = f"Sobre mi formación académica: obtuve el título de {edu['degree']} en {edu['institution']}."
    corpus.append(doc)

# ¡PEQUEÑA MEJORA AQUÍ! Hacemos los documentos de certificados más explícitos.
for cert in knowledge_base['certifications']:
    skills = ', '.join(cert['skills'])
    doc = f"Tengo una certificación profesional llamada {cert['name']}. Este certificado es de {cert['issuer']}. Algunas de las habilidades de esta certificación son {skills}. Es una de mis certificaciones oficiales."
    corpus.append(doc)

# ... (El resto de la creación del corpus va aquí, sin cambios) ...
corpus.append(f"Un resumen sobre mi perfil profesional: {knowledge_base['professionalSummary']}")
corpus.append(f"Información de contacto: mi email es {knowledge_base['personalInfo']['email']} y mi teléfono es {knowledge_base['personalInfo']['phone']}.")

# --- Vectorización del Corpus ---
vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(corpus)


# --- Definición del Modelo de Pregunta ---
class Query(BaseModel):
    text: str


# --- ENDPOINTS DE LA API ---

@app.get("/")
def read_root():
    return {"Status": "Backend en línea", "Documentos en Corpus": len(corpus)}

# --- ENDPOINT DEL CHATBOT MEJORADO CON LÓGICA HÍBRIDA (v2.0) ---
@app.post("/ask")
def ask_question(query: Query):
    user_query = query.text.lower() # Convertimos la pregunta a minúsculas

    # --- Nivel 1: Reglas Predefinidas para Preguntas Generales ---

    # Regla para "experiencia laboral"
    if "experiencia laboral" in user_query or "trabajos" in user_query or "experiencia" == user_query:
        all_jobs = [f"{exp['role']} en {exp['company']}" for exp in knowledge_base['workExperience']]
        answer = f"Tengo experiencia en varios roles, incluyendo: {', '.join(all_jobs)}. Puedes preguntarme por uno en específico para más detalles."
        return {"answer": answer}

    # Regla para "certificados" o "certificaciones"
    if "certificados" in user_query or "certificaciones" in user_query:
        all_certs = [cert['name'] for cert in knowledge_base['certifications']]
        answer = f"Claro, tengo varias certificaciones profesionales, entre ellas: {', '.join(all_certs)}. ¿Quieres saber más sobre alguna en particular?"
        return {"answer": answer}
        
    # Regla para "educación" o "estudios"
    if "educación" in user_query or "estudios" in user_query or "formación" in user_query:
        all_degrees = [f"{edu['degree']} en {edu['institution']}" for edu in knowledge_base['education']]
        answer = f"Mi formación académica principal incluye: {', '.join(all_degrees)}."
        return {"answer": answer}

    # --- Nivel 2: Modelo de IA para Preguntas Específicas ---
    # Si ninguna regla se cumple, pasamos la pregunta al modelo de IA.
    
    query_vector = vectorizer.transform([query.text])
    cosine_similarities = cosine_similarity(query_vector, tfidf_matrix).flatten()
    most_similar_doc_index = np.argmax(cosine_similarities)
    
    # Un pequeño umbral de confianza. Si la similitud es muy baja, damos una respuesta genérica.
    if cosine_similarities[most_similar_doc_index] < 0.1:
        return {"answer": "Mmm, no estoy seguro de tener información sobre eso. Intenta reformular tu pregunta."}
        
    return {"answer": corpus[most_similar_doc_index]}

@app.get("/profile")
def get_profile():
    return {
        "personalInfo": knowledge_base["personalInfo"],
        "professionalSummary": knowledge_base["professionalSummary"]
    }

@app.get("/experience")
def get_experience():
    return {"workExperience": knowledge_base["workExperience"]}

@app.get("/education")
def get_education():
    return {"education": knowledge_base["education"]}

@app.get("/skills")
def get_skills():
    return {"skills": knowledge_base["skills"]}

@app.get("/certifications")
def get_certifications():
    return {"certifications": knowledge_base["certifications"]}