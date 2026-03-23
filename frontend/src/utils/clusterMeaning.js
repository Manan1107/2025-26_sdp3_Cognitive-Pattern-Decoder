export const getClusterMeaning = (cluster) => {
  switch (cluster) {
    case 0:
      return {
        title: "Analytical Thinker",
        description:
          "High accuracy, structured workflow, careful typing behavior."
      };
    case 1:
      return {
        title: "Fast Executor",
        description:
          "High typing speed with low pause time and minimal corrections."
      };
    case 2:
      return {
        title: "Creative Explorer",
        description:
          "Frequent cursor movement, switching files, adaptive behavior."
      };
    default:
      return {
        title: "Unknown",
        description: "Not enough data available."
      };
  }
};