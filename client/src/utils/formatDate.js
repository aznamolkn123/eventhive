export const formatDate = (isoString, style = "short") => {
  const date = new Date(isoString);

  if (style === "long") {
    const formattedDate = new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);

    const formattedTime = new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);

    return `${formattedDate} at ${formattedTime}`;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

