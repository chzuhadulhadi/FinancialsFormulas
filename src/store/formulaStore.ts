import { create } from 'zustand';

type FormulaStore = {
  formula: string[];
  addTag: (tag: string) => void;
  updateTag: (index: number, newTag: string) => void;
  removeTag: (index: number) => void;
  setFormula: (newFormula: string[]) => void;
};

const useFormulaStore = create<FormulaStore>((set) => ({
  formula: [],
  addTag: (tag) => set((state) => ({ formula: [...state.formula, tag] })),
  updateTag: (index, newTag) => set((state) => {
    const newFormula = [...state.formula];
    newFormula[index] = newTag;
    return { formula: newFormula };
  }),
  removeTag: (index) => set((state) => ({
    formula: state.formula.filter((_, i) => i !== index)
  })),
  setFormula: (newFormula) => set({ formula: newFormula }),
}));

export default useFormulaStore;
