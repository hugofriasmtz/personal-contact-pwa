const recentGreetings: Set<number> = new Set();
export const maxRecentGreetings = 8; // Number of recent greetings to track

const hoursLeft = 24 - new Date().getHours();

const greetingsText: string[] = [
  "¡Hagamos que hoy cuente! **1f680**",
  "¡Organiza tus contactos y conquista el día!",
  "¡Mantén tus contactos al alcance de tu mano!",
  "¡Organiza tus contactos y mantente conectado!",
  "¡Gestiona tus contactos de manera eficiente!",
  "¡Encuentra a tus amigos y familiares fácilmente!",
  "¡Nunca pierdas un contacto importante!",
  "¡Mantén tu lista de contactos siempre actualizada!",
  "¡Conéctate con tus seres queridos en un clic!",
  "¡Simplifica la gestión de tus contactos!",
  "¡Accede a tus contactos desde cualquier lugar!",
  "¡Organiza tus contactos por categorías!",
  "¡Encuentra rápidamente a quien necesitas!",
  "¡Mantén tus contactos personales y profesionales separados!",
  "¡Gestiona tus contactos con facilidad!",
  "¡Mantén tu red de contactos siempre a mano!",
  "¡Encuentra y contacta a tus amigos rápidamente!",
  "¡Organiza y sincroniza tus contactos!",
  "¡Mantén tus contactos seguros y accesibles!",
  "¡Gestiona tus contactos de manera inteligente!",
  "¡Encuentra a tus contactos en segundos!",
  "¡Mantén tu lista de contactos limpia y organizada!",
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
