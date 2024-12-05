const recentGreetings: Set<number> = new Set();
export const maxRecentGreetings = 8; // Number of recent greetings to track

const hoursLeft = 24 - new Date().getHours();

const greetingsText: string[] = [
  "¡Hagamos que hoy cuente! **1f680**",
  "¡Organiza tus contactos y conquista el día!",
  "¡Abraza el poder de la organización!",
  "Establece tus metas, consíguelas, repite.",
  "¡Hoy es una nueva oportunidad para ser organizado!",
  "Haz que cada momento cuente.",
  "Mantente organizado, mantente adelante.",
  "¡Toma el control de tu día!",
  "Un contacto a la vez, ¡tú puedes!",
  "La organización es la clave del éxito. **1f511**",
  "¡Convirtamos los planes en logros!",
  "Empieza pequeño, logra en grande.",
  "Sé eficiente, sé organizado.",
  "¡Aprovecha el poder de la organización!",
  "¡Prepárate para hacer que las cosas sucedan!",
  "¡Es hora de revisar esos contactos! **2705**",
  "¡Empieza tu día con un plan! **1f5d3-fe0f**",
  "Mantente enfocado, mantente organizado.",
  "Desbloquea tu potencial de organización. **1f513**",
  "¡Convierte tu lista de contactos en una lista de hechos! **1f4dd**",
  `¡Ten un maravilloso ${new Date().toLocaleDateString("es", {
    weekday: "long",
  })}!`,
  `¡Feliz ${new Date().toLocaleDateString("es", {
    month: "long",
  })}! ¡Un gran mes para la organización!`,
  hoursLeft > 4
    ? `${hoursLeft} horas restantes en el día. ¡Úsalas sabiamente!`
    : `Solo ${hoursLeft} horas restantes en el día`,
];

/**
 * Returns a random greeting message to inspire productivity.
 * @returns {string} A random greeting message with optional emoji code.
 */
export const getRandomGreeting = (): string => {
  // Function to get a new greeting that hasn't been used recently
  const getUniqueGreeting = (): string => {
    let randomIndex: number;
    do {
      randomIndex = Math.floor(Math.random() * greetingsText.length);
    } while (recentGreetings.has(randomIndex));

    // Update recent greetings
    recentGreetings.add(randomIndex);
    if (recentGreetings.size > maxRecentGreetings) {
      const firstEntry = Array.from(recentGreetings).shift();
      if (firstEntry !== undefined) {
        recentGreetings.delete(firstEntry);
      }
    }

    return greetingsText[randomIndex];
  };

  return getUniqueGreeting();
};
