import { WalkthroughStep } from '../components/Walkthrough';

export const generatePageSteps: WalkthroughStep[] = [
  {
    id: 'welcome',
    target: 'body', // Will be centered
    title: '🎨 Welcome to AI Icon Maker!',
    content: 'Let\'s take a quick tour to help you create amazing icons with AI. This will only take a minute!',
    position: 'center',
    nextButton: 'Start Tour'
  },
  {
    id: 'chat-panel',
    target: '[data-walkthrough="chat-panel"]',
    title: '💬 Chat with AI',
    content: 'This is where you describe the icon you want to create. Just type naturally - like "shopping cart icon" or "modern settings gear".',
    position: 'right',
    nextButton: 'Got it'
  },
  {
    id: 'style-selector',
    target: '[data-walkthrough="style-selector"]',
    title: '🎨 Choose Your Style',
    content: 'Pick from different styles like Modern, Flat, 3D, or Minimalist. Each style gives your icons a unique look and feel.',
    position: 'top',
    nextButton: 'Next'
  },
  {
    id: 'prompt-input',
    target: '[data-walkthrough="prompt-input"]',
    title: '✍️ Describe Your Icon',
    content: 'Type your icon description here. Be specific! Instead of "icon", try "blue shopping cart with rounded corners" for better results.',
    position: 'top',
    nextButton: 'Continue'
  },
  {
    id: 'generate-button',
    target: '[data-walkthrough="generate-button"]',
    title: '🚀 Generate Icons',
    content: 'Click this button to create your icons! The AI will generate multiple variations based on your description.',
    position: 'left',
    nextButton: 'Awesome'
  },
  {
    id: 'results-panel',
    target: '[data-walkthrough="results-panel"]',
    title: '🎯 Your Generated Icons',
    content: 'Your icons will appear here! You can improve any icon by clicking on it, or download the ones you love.',
    position: 'left',
    nextButton: 'Nice'
  },
  {
    id: 'improve-icons',
    target: '[data-walkthrough="results-panel"]',
    title: '✨ Improve Your Icons',
    content: 'Click on any generated icon to enter improvement mode. Then describe changes like "make it more colorful", "add shadows", or "change to blue" to refine your icon.',
    position: 'left',
    nextButton: 'Perfect'
  },
  {
    id: 'sidebar-navigation',
    target: '[data-walkthrough="sidebar"]',
    title: '🧭 Navigation',
    content: 'Use the sidebar to navigate between generating icons, viewing your library, checking usage limits, and getting help.',
    position: 'right',
    nextButton: 'Finish'
  }
];

export const improvementModeSteps: WalkthroughStep[] = [
  {
    id: 'improvement-welcome',
    target: '[data-walkthrough="improvement-panel"]',
    title: '✨ Icon Improvement Mode',
    content: 'Great! Now you can refine this icon. Describe what changes you\'d like - "make it more colorful", "add shadows", or "change to blue".',
    position: 'right',
    nextButton: 'Got it'
  },
  {
    id: 'improvement-suggestions',
    target: '[data-walkthrough="improvement-suggestions"]',
    title: '💡 Quick Suggestions',
    content: 'Use these quick suggestion buttons for common improvements, or type your own custom changes in the input field.',
    position: 'right',
    nextButton: 'Perfect'
  }
];