import { useCallback, useRef } from 'react';
import { DISCORD_WEBHOOK_URL } from '../utils/env';

// Detect mobile vs desktop
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const useDiscordWebhook = () => {
  const sentEvents = useRef(new Set());

  const sendEvent = useCallback(async (eventType, additionalData = {}) => {
    // Skip if no webhook URL configured
    if (!DISCORD_WEBHOOK_URL) {
      console.log('Discord webhook not configured, skipping event:', eventType);
      return;
    }

    // Prevent duplicate events (except link clicks which can happen multiple times)
    const eventKey = eventType === 'link_click' ? `${eventType}_${Date.now()}` : eventType;
    if (eventType !== 'link_click' && sentEvents.current.has(eventType)) {
      return;
    }

    try {
      const payload = {
        content: null,
        embeds: [{
          title: '🎂 Birthday Card Event',
          fields: [
            { name: 'Event', value: eventType, inline: true },
            { name: 'Device', value: isMobile() ? 'Mobile 📱' : 'Desktop 💻', inline: true },
            { name: 'Timestamp', value: new Date().toLocaleString('cs-CZ'), inline: false },
            ...Object.entries(additionalData).map(([key, value]) => ({
              name: key,
              value: String(value),
              inline: true,
            })),
          ],
          color: eventType === 'page_load' ? 0xFF7AB6 : // Pink
                 eventType === 'scroll' ? 0x7AA2FF : // Blue
                 eventType === 'link_click' ? 0xFFD700 : // Gold
                 eventType === 'date_selected' ? 0x90EE90 : // Green
                 eventType === 'incorrect_answer' ? 0xFF4444 : // Red
                 eventType === 'gift_reveal_click' ? 0xFF69B4 : // Hot Pink
                 eventType === 'calendar_opened' ? 0x9370DB : // Medium Purple
                 0xCCCCCC, // Default gray
          timestamp: new Date().toISOString(),
        }],
      };

      const response = await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok && eventType !== 'link_click') {
        sentEvents.current.add(eventType);
      }
    } catch (error) {
      // Silent fail - don't block UX
      console.error('Discord webhook error:', error);
    }
  }, []);

  return { sendEvent };
};
