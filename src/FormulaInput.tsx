// src/components/FormulaInput.tsx
import React, { useState, useEffect } from 'react';
import useFormulaStore from './store/formulaStore';
import { useAutocomplete } from './api/autocomplete';
import { evaluate } from 'mathjs';
import { TextField, Chip, Autocomplete, Typography, Grid } from '@mui/material';

const operators = ['+', '-', '*', '/', '^', '(', ')'];

const FormulaInput: React.FC = () => {
  const { formula, addTag, updateTag, removeTag } = useFormulaStore();
  const [currentInput, setCurrentInput] = useState('');
  const { data: suggestions } = useAutocomplete(currentInput);
  const [calculatedResult, setCalculatedResult] = useState<string | number>('');
  const [editchip, setEditChip] = useState<number | null>(null);

  const isOperator = (tag: string) => operators.includes(tag);
  const handleInputChange = (event: any, newValue: string) => {
    setCurrentInput(newValue);
    // Check if the newValue is an operator and add it immediately as a tag
    if (isOperator(newValue.trim())) {
      addTag(newValue.trim());
      setCurrentInput(''); // Clear the current input after adding the operator as a tag
    }
  };
  // console.log(formula,formula.length - 1);
  const handleChange = (event: any, newVal: string | any[]) => {
    if (event?.key === 'Backspace' && currentInput.length === 0) {
      removeTag(formula.length - 1);
    }
    else if (event.key === 'Enter') {
      addTag(newVal[newVal.length - 1].name);
      setCurrentInput('');
    }
  };

  const evaluateFormula = () => {
    try {
      const computedformula = formula.map((tag) => {
        if (isOperator(tag)) {
          return tag;
        }
        return suggestions?.find((suggestion) => suggestion.name === tag)?.value || tag;
      }
      );
      const expression = computedformula.join(' ');
      const result = evaluate(expression);
      setCalculatedResult(result);
    } catch (error) {
      setCalculatedResult('Error');
    }
  };

  useEffect(() => {
    evaluateFormula();
  }, [formula]);

  return (
    <div>
      <div className="formula-input">
        <Autocomplete
          freeSolo
          multiple
          onClose={evaluateFormula}
          renderTags={(value: any[], getTagProps) =>
            formula?.map((option: string, index: number) => (
              (isOperator(option) || !suggestions?.find((suggestion) => suggestion.name === option))
                ? <Typography key={index} variant="body1">{option}</Typography> :
                editchip === index ?
                  <input
                    key={index}
                    style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '1rem' }}
                    defaultValue={option}
                    autoFocus
                    onBlur={(e) => {
                      updateTag(index, e.target.value);
                      setEditChip(null);
                    }}
                  />
                  :
                  <Chip
                    variant="outlined"
                    label={option}
                    onClick={() => setEditChip(index)}
                    {...getTagProps({ index })}
                    onDelete={() => removeTag(index)}
                  />
            ))
          }
          options={suggestions || []}
          getOptionLabel={(option) => option.name}
          inputValue={currentInput}
          onChange={handleChange}
          onInputChange={handleInputChange}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
            // onKeyDown={handleKeyDown}
            />
          )}
        />
      </div>
      <Grid container spacing={2}>
        <Grid item>
          <Typography variant="h3">Result:</Typography>
        </Grid>
        <Grid item>
          <Typography variant="h3">{calculatedResult}</Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default FormulaInput;
