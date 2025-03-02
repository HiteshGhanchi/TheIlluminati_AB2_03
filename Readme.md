#  <p align=center >Doc-GPT</p>

Doc-GPT is a healthcare solution system for doctors and other healthcare professionals to get real-time, supportive, RAG-augmented decision making regarding medical scenarios. Our tech stack includes : 

**MongoDB** : A robust NoSQL database to store user data, as well as chat and medical records.

**Next.js** : A state of the art frontend framework.

**Node.js** : Backend maestro for js runtime environment.

**Langchain** : To create RAG pipelines efficiently.

**LLAMA 3.3 70B parameters** : The GenAI model we used.

**FAISS DB** : Vector storage

## 1. Installation guide

Clone the repo : 
```
 git clone git@github.com:HiteshGhanchi/TheIlluminati_AB2_03.git
```

In the frontend and backend folders, download the dependencies:
```cd frontend
    npm i
    cd ../backend/
    npm i
```

Run both frontend and backend:
```
npm run start
cd ../frontend
npm run dev
```