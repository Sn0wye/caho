'use client';

import { useRef } from 'react';
import { Input } from './ui/input';

const ROOM_CODE_SIZE = 6;
const DIGIT_BLANK = ' ';

interface RoomCodeInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function RoomCodeInput({ onChange, value }: RoomCodeInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const codeDigits = new Array(ROOM_CODE_SIZE)
    .fill(DIGIT_BLANK)
    .map((space, idx) => value[idx] ?? space);

  function handleOnChange(index: number, digit: string) {
    const nextCodeDigits = [...codeDigits];

    if (digit === '') {
      nextCodeDigits[index] = DIGIT_BLANK;
      inputsRef.current[index - 1]?.focus();
    } else {
      nextCodeDigits[index] = digit.toUpperCase();
      inputsRef.current[index + 1]?.focus();
    }

    const stringifiedDigits = nextCodeDigits.join('').slice(0, ROOM_CODE_SIZE);
    onChange(stringifiedDigits);

    console.table({
      codeDigits,
      stringifiedDigits,
      index,
      digit,
      nextCodeDigits
    });
  }

  function handleInputFocus(index: number) {
    if (index === 0) return;

    const currentInput = inputsRef.current[index];
    const nearestEmptyInput = inputsRef.current
      .slice(0, index)
      .reverse()
      .find(input => input?.value === '');

    if (currentInput?.value !== '') {
      currentInput?.focus();
      return;
    }

    nearestEmptyInput?.focus();
  }

  return (
    <div className="grid grid-cols-6 gap-2">
      {Array.from({ length: ROOM_CODE_SIZE }, (_, index) => (
        <Input
          key={index}
          type="text"
          onFocus={() => handleInputFocus(index)}
          autoComplete="off"
          maxLength={1}
          aria-label={`Insira ${index + 1} dígito do código da sala`}
          ref={element => {
            inputsRef.current[index] = element;
          }}
          className="h-12 text-center font-mono text-xl font-bold"
          value={codeDigits[index] === DIGIT_BLANK ? '' : codeDigits[index]}
          onChange={e => handleOnChange(index, e.target.value)}
        />
      ))}
    </div>
  );
}
