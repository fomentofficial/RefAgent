import { Template } from '@/types';

export const templates: Template[] = [
  {
    id: 'classic',
    name: '클래식',
    description: '전통적이고 정중한 디자인',
    backgroundColor: '#FFFFFF',
    textColor: '#1A1A1A',
    accentColor: '#4A5568',
    fontFamily: 'serif',
  },
  {
    id: 'modern',
    name: '모던',
    description: '깔끔하고 현대적인 디자인',
    backgroundColor: '#F7FAFC',
    textColor: '#2D3748',
    accentColor: '#2B6CB0',
    fontFamily: 'sans-serif',
  },
  {
    id: 'elegant',
    name: '우아한',
    description: '부드럽고 우아한 디자인',
    backgroundColor: '#FFF5F5',
    textColor: '#2D3748',
    accentColor: '#C53030',
    fontFamily: 'serif',
  },
  {
    id: 'minimal',
    name: '미니멀',
    description: '심플하고 간결한 디자인',
    backgroundColor: '#FAFAFA',
    textColor: '#212121',
    accentColor: '#616161',
    fontFamily: 'sans-serif',
  },
];

export function getTemplateById(id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}
