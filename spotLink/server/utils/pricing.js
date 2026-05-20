/**
 * Calculate dynamic price based on occupancy, peak hours, and weekend rates.
 * @param {number} basePrice 
 * @param {number} availableSlots 
 * @param {number} totalSlots 
 * @returns {object} { dynamicPrice, demandFactor }
 */
export const calculateDynamicPrice = (basePrice, availableSlots, totalSlots) => {
  const occupancyRate = 1 - (availableSlots / totalSlots);
  const hour = new Date().getHours();
  
  // Peak hour factors
  const timeFactor = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20) ? 1.5 : hour >= 22 || hour <= 6 ? 0.75 : 1.0;
  
  // Occupancy factors
  const occupancyFactor = occupancyRate > 0.8 ? 1.4 : occupancyRate > 0.5 ? 1.2 : occupancyRate < 0.2 ? 0.85 : 1.0;
  
  // Weekend factors
  const dayFactor = [0, 6].includes(new Date().getDay()) ? 1.3 : 1.0;
  
  const dynamicPrice = +(basePrice * timeFactor * occupancyFactor * dayFactor).toFixed(2);
  const demandFactor = +(timeFactor * occupancyFactor * dayFactor).toFixed(2);
  
  return { dynamicPrice, demandFactor };
};
