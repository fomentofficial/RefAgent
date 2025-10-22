import { Template } from '@/types';

export const templates: Template[] = [
  {
    id: 'classic',
    name: '클래식',
    description: '전통적이고 정중한 디자인',
    backgroundColor: '#FDFCFA',
    textColor: '#1A1A1A',
    accentColor: '#8B7355',
    fontFamily: 'serif',
  },
  {
    id: 'modern',
    name: '모던',
    description: '깔끔하고 현대적인 디자인',
    backgroundColor: '#F8FAFB',
    textColor: '#1E293B',
    accentColor: '#3B82F6',
    fontFamily: 'sans-serif',
  },
  {
    id: 'elegant',
    name: '우아한',
    description: '부드럽고 우아한 디자인',
    backgroundColor: '#FFF8F8',
    textColor: '#4A4A4A',
    accentColor: '#D4526E',
    fontFamily: 'serif',
  },
  {
    id: 'minimal',
    name: '미니멀',
    description: '심플하고 간결한 디자인',
    backgroundColor: '#FFFFFF',
    textColor: '#0A0A0A',
    accentColor: '#525252',
    fontFamily: 'sans-serif',
  },
];

export function getTemplateById(id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}
