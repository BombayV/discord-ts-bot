type Sizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type Size = {
  [key in Sizes]: number;
};
type AvatarSizes = {
  name: string;
  value: Sizes;
}


export const AVAILABLE_SIZES: Size = {
  'xs': 64,
  'sm': 128,
  'md': 256,
  'lg': 512,
  'xl': 1024,
}

export const AVATAR_SIZES: AvatarSizes[] = [
  { name: 'Extra Small', value: 'xs'},
  { name: 'Small', value: 'sm' },
  { name: 'Medium', value: 'md' },
  { name: 'Large', value: 'lg' },
  { name: 'Extra Large', value: 'xl' },
]

export const AVAILABLE_RESPONSES: string[] = [
  'Yes',
  'No',
  'Maybe',
  'Ask again later',
  'Definitely',
  'You ballin',
  'You trippin',
  'Sure thing',
  'Nah, I\'d win',
  'Why not',
]