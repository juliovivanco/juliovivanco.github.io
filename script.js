document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================
       1. NAVEGACIÓN DE PESTAÑAS (EXPERIENCIA)
       ========================================== */
    const xpButtons = document.querySelectorAll('.xp-nav-btn');
    const xpPanes = document.querySelectorAll('.xp-tab-pane');

    xpButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Quitar clase active de botones y paneles
            xpButtons.forEach(b => b.classList.remove('active'));
            xpPanes.forEach(pane => pane.classList.remove('active'));

            // Añadir clase active al seleccionado
            btn.classList.add('active');
            const activePane = document.getElementById(`xp-${targetTab}`);
            if (activePane) {
                activePane.classList.add('active');
            }
        });
    });

    /* ==========================================
       2. ASISTENTE DE IA DE JULIO (SIMULADOR)
       ========================================== */
    const chatMessages = document.getElementById('chat-messages-container');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatSuggestions = document.getElementById('chat-suggestions-container');

    // Base de conocimiento para respuestas del Agente
    const knowledgeBase = {
        experiencia: "Julio tiene **una sólida trayectoria** liderando soluciones tecnológicas empresariales. Actualmente se desempeña como **Co-Fundador y CTO en Realzo**, y de forma independiente como **Lead Software Architect en Tannua** y **Architect Leader en Protiviti Perú**, liderando la práctica de integración con MuleSoft.",
        tecnologias: "El ecosistema técnico de Julio abarca:\n\n• **Inteligencia Artificial**: OpenAI API, LangChain, LangGraph y Agentforce (Salesforce).\n• **Plataformas Cloud & CRM**: MuleSoft, Salesforce, AWS, Azure, Google Cloud (GCP) e integraciones de APIs complejas.\n• **Arquitectura, Integración y Buenas Prácticas**: Microservicios, APIs REST/SOAP, Arquitectura Hexagonal, DDD, CQRS, Arquitectura Orientada a Eventos (EDA), Clean Architecture, SOLID, TDD, Clean Code, CI/CD y Patrones Enterprise.\n• **Lenguajes y Frameworks**: .NET Core / C#, ASP.NET Core, Python, Node.js, Angular, TypeScript, SQL Server, PostgreSQL, Azure DevOps, Flutter, Android nativo (Kotlin), Dart y Kotlin.",
        agentes: "Julio es especialista en el desarrollo de **Agentes Inteligentes y Cognitivos**. Diseña arquitecturas avanzadas utilizando **LangGraph** (para flujos cíclicos complejos de agentes), **LangChain** (para cadenas de prompts y RAG) y **Agentforce** (para automatizar procesos de negocio integrados en Salesforce con IA de última generación).",
        contacto: "Puedes conectar con Julio o agendar una reunión mediante su [LinkedIn](https://www.linkedin.com/in/julio-c%C3%A9sar-vivanco-v%C3%A1squez-a1787a133/) o escribiéndole un correo electrónico a [julioc.vivanco@gmail.com](mailto:julioc.vivanco@gmail.com).",
        saludo: "¡Hola! Qué gusto saludarte. Soy el asistente inteligente de Julio. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre su experiencia, stack tecnológico, su filosofía de desarrollo o cómo contactarlo.",
        android: "Julio tiene experiencia sólida en desarrollo móvil, particularmente con **Flutter y Android nativo (Kotlin/Java)**. Está familiarizado con la integración de APIs complejas, sistemas de monetización como AdMob, y el ciclo completo de publicación y pruebas cerradas en Google Play Console.",
        mulesoft: "En **Protiviti Perú**, Julio lidera la práctica de integración basada en **MuleSoft**. Diseña arquitecturas de integración orientadas a servicios (SOA) y microservicios escalables, conectando sistemas heredados con plataformas modernas y cloud.",
        salesforce: "Julio trabaja estrechamente con soluciones **Salesforce**, aportando soporte de arquitectura técnica para la sincronización de datos de negocio y, recientemente, integrando capacidades cognitivas avanzadas con la suite de **Agentforce**.",
        filosofia: "Para Julio, **el desarrollo de software no es un empleo, es una forma de vida**. Él sostiene firmemente que una vez que el código entra en tu sangre, no hay vuelta atrás: naces programador y te vas como programador, y no existe mejor final que compilar tu mejor obra. Esta pasión es la que impulsa la excelencia en cada una de sus arquitecturas y agentes inteligentes."
    };

    // Respuestas preprogramadas asociadas a palabras clave
    const keywords = [
        { keys: ['experiencia', 'trayectoria', 'trabajo', 'cargo', 'puesto', 'trabajado', 'cto', 'architect', 'arquitecto', 'realzo', 'tannua', 'protiviti'], responseKey: 'experiencia' },
        { keys: ['tecnologia', 'stack', 'lenguaje', 'programacion', 'skills', 'habilidades', 'domina', 'herramientas', 'usar', 'usa', 'dotnet', 'net', 'c#', 'microsoft', 'sql', 'devops', 'gcp', 'google cloud', 'patrones', 'ddd', 'cqrs', 'hexagonal', 'clean', 'eda', 'eventos', 'python', 'node', 'nodejs', 'angular', 'typescript', 'ts', 'postgres', 'postgresql', 'solid', 'tdd', 'clean code', 'cicd'], responseKey: 'tecnologias' },
        { keys: ['agente', 'ia', 'ai', 'langchain', 'langgraph', 'agentforce', 'inteligencia', 'openai', 'llm', 'rag'], responseKey: 'agentes' },
        { keys: ['contacto', 'contactar', 'correo', 'email', 'escribir', 'hablar', 'linkedin', 'redes', 'contratar', 'contactarlo'], responseKey: 'contacto' },
        { keys: ['hola', 'buenos', 'tardes', 'dias', 'saludo', 'que tal'], responseKey: 'saludo' },
        { keys: ['android', 'flutter', 'movil', 'mobile', 'kotlin', 'dart', 'play', 'admob'], responseKey: 'android' },
        { keys: ['mulesoft', 'integracion', 'api', 'microservicios', 'soa'], responseKey: 'mulesoft' },
        { keys: ['salesforce', 'crm', 'agentforce'], responseKey: 'salesforce' },
        { keys: ['filosofia', 'vision', 'manifiesto', 'pasion', 'frase', 'vaquero', 'yellowstone', 'vida'], responseKey: 'filosofia' }
    ];

    // Función para formatear el texto en el chat (Markdown básico a HTML)
    function formatMessageText(text) {
        let formatted = text
            // Formatear saltos de línea
            .replace(/\n/g, '<br>')
            // Formatear negritas (**texto**)
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Formatear enlaces de markdown [texto](url)
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: var(--accent-blue); text-decoration: underline; font-weight: 600;">$1</a>');
        return formatted;
    }

    // Desplazar el scroll hacia abajo en el contenedor de mensajes
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Agregar una burbuja de mensaje en la interfaz
    function appendMessageBubble(text, sender) {
        const bubble = document.createElement('div');
        bubble.classList.add('chat-bubble', sender === 'user' ? 'bubble-user' : 'bubble-agent');
        bubble.innerHTML = formatMessageText(text);
        chatMessages.appendChild(bubble);
        scrollToBottom();
    }

    // Mostrar el indicador de escritura simulado ("pensando")
    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.classList.add('chat-bubble', 'bubble-agent');
        indicator.id = 'chat-typing-indicator';
        indicator.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        chatMessages.appendChild(indicator);
        scrollToBottom();
    }

    // Quitar el indicador de escritura
    function removeTypingIndicator() {
        const indicator = document.getElementById('chat-typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    // Procesar la entrada del usuario y generar respuesta
    function processUserMessage(message, forcedResponseKey = null) {
        if (!message.trim()) return;

        // Añadir mensaje del usuario
        appendMessageBubble(message, 'user');

        // Mostrar indicador de escritura
        showTypingIndicator();

        // Normalizar entrada del usuario para buscar palabras clave
        const normalizedInput = message.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, ""); // Quitar acentos

        let matchedResponseKey = forcedResponseKey;

        if (!matchedResponseKey) {
            // Buscar correspondencia en palabras clave
            for (const item of keywords) {
                const hasKeyword = item.keys.some(key => normalizedInput.includes(key));
                if (hasKeyword) {
                    matchedResponseKey = item.responseKey;
                    break;
                }
            }
        }

        // Respuesta final
        const responseText = matchedResponseKey 
            ? knowledgeBase[matchedResponseKey] 
            : "Entiendo tu pregunta. Julio cuenta con una amplia experiencia y puedo darte detalles sobre su 'experiencia' corporativa, su 'stack tecnológico', sus desarrollos en 'agentes de IA' (como LangGraph/Agentforce) o indicarte cómo 'contactarlo'. ¿De cuál de estos temas te gustaría saber más?";

        // Simular retardo natural del procesamiento del Agente (1.2 segundos)
        setTimeout(() => {
            removeTypingIndicator();
            appendMessageBubble(responseText, 'agent');
        }, 1200);
    }

    // Manejar envío de formulario
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = chatInput.value;
        if (text.trim()) {
            processUserMessage(text);
            chatInput.value = '';
        }
    });

    // Manejar clics en sugerencias rápidas
    chatSuggestions.addEventListener('click', (e) => {
        if (e.target.classList.contains('suggestion-chip')) {
            const suggestionText = e.target.textContent;
            const forcedKey = e.target.getAttribute('data-question');
            processUserMessage(suggestionText, forcedKey);
        }
    });
});
