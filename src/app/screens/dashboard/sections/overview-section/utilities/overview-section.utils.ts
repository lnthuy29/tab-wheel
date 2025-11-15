/**
 * Defines the possible sessions of the day as a String Enum.
 */
export enum DaySession {
  Morning = 'morning',
  Afternoon = 'afternoon',
  Evening = 'evening',
}

export function getSessionOfDay(
  date: Date = new Date(),
): DaySession {
  // Get the hour in 24-hour format (0-23)
  const currentHour = date.getHours();

  // Morning: 00:00 to 11:59 (0 <= hour < 12)
  if (currentHour >= 0 && currentHour < 12) {
    return DaySession.Morning;
  }
  // Afternoon: 12:00 to 17:59 (12 <= hour < 18)
  else if (currentHour >= 12 && currentHour < 18) {
    return DaySession.Afternoon;
  }
  // Evening: 18:00 to 23:59 (18 <= hour <= 23)
  else {
    return DaySession.Evening;
  }
}

export function getGreeting(session: DaySession): string {
  return `Good ${session}!`;
}
