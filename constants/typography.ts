import { fontSizes, getTextStyles } from './responsive';

export const typography = {
  // Titres
  h1: {
    ...getTextStyles('3xl'),
    fontFamily: 'KumbhSans_700Bold',
  },
  h2: {
    ...getTextStyles('2xl'),
    fontFamily: 'KumbhSans_700Bold',
  },
  h3: {
    ...getTextStyles('xl'),
    fontFamily: 'KumbhSans_600SemiBold',
  },
  
  // Textes
  body: {
    ...getTextStyles('base'),
    fontFamily: 'KumbhSans_400Regular',
  },
  bodyBold: {
    ...getTextStyles('base'),
    fontFamily: 'KumbhSans_700Bold',
  },
  bodySmall: {
    ...getTextStyles('sm'),
    fontFamily: 'KumbhSans_400Regular',
  },
  
  // Boutons
  button: {
    ...getTextStyles('base'),
    fontFamily: 'KumbhSans_600SemiBold',
    textAlign: 'center',
  },
  buttonLarge: {
    ...getTextStyles('lg'),
    fontFamily: 'KumbhSans_600SemiBold',
    textAlign: 'center',
  },
  
  // Inputs
  input: {
    ...getTextStyles('base'),
    fontFamily: 'KumbhSans_400Regular',
  },
  inputLabel: {
    ...getTextStyles('sm'),
    fontFamily: 'KumbhSans_500Medium',
    marginBottom: 8,
  },
  
  // Placeholders
  placeholder: {
    ...getTextStyles('base'),
    fontFamily: 'KumbhSans_400Regular',
    opacity: 0.7,
  },
  
  // Liens
  link: {
    ...getTextStyles('base'),
    fontFamily: 'KumbhSans_600SemiBold',
    textDecorationLine: 'underline',
  },
};

export default typography;
