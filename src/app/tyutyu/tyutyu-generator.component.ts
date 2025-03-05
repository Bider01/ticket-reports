import { Component } from '@angular/core';

@Component({
  selector: 'app-tyutyu-generator',
  templateUrl: './tyutyu-generator.component.html',
  styleUrls: ['./tyutyu-generator.component.scss']
})
export class TyutyuGeneratorComponent {
  inputText: string = '';
  formattedText: string[] = [];
  errorMessage: string | null = null; // Hibaüzenet tárolása

  // Betűméretek (cm-ben), Excel alapján
  letterWidths: { [key: string]: number } = {
    'M': 6, 'W': 6, '.': 1, '…': 5, ';': 1, '"': 2, "'": 1, '(': 2, ')': 2, ':': 1
  };
  defaultWidth = 5; // Normál betűk szélessége
  wordSpacing = 4;  // Szóköz távolsága
  letterSpacing = 1; // Betűk közötti távolság
  lineHeight = 2;   // Sorok közötti távolság
  letterHeight = 10; // Betűk magassága
  maxCharsPerLine = 8;
  maxLines = 3;

  constructor() {
    this.formatText();
  }

  formatText(): void {
    let lines = this.inputText.toUpperCase().split('\n').map(line => line.trim()).filter(line => line.length > 0);

    if (lines.length === 0) {
      this.formattedText = [];
      this.errorMessage = null;
      return;
    }

    let autoWrappedLines: string[] = [];
    lines.forEach(line => {
      autoWrappedLines.push(...this.wrapLine(line));
    });

    if (autoWrappedLines.length > this.maxLines) {
      this.errorMessage = `HIBA: A szöveg túl hosszú! Maximum ${this.maxLines} sor engedélyezett.`;
      this.formattedText = [];
    } else {
      this.errorMessage = null;
      this.formattedText = autoWrappedLines;
    }
  }

  wrapLine(text: string): string[] {
    let words = text.split(' ');
    let lines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
      let testLine = currentLine ? `${currentLine} ${word}` : word;
      if (this.calculateWidth(testLine) <= this.maxCharsPerLine * this.defaultWidth) {
        currentLine = testLine;
      } else {
        if (lines.length < this.maxLines - 1) {
          lines.push(currentLine);
          currentLine = word;
        }
      }
    });

    if (currentLine) lines.push(currentLine);
    return lines;
  }

  calculateWidth(text: string): number {
    return text.split('').reduce((sum, char, index, arr) => {
      let charWidth = this.letterWidths[char] || this.defaultWidth;
      let extraSpace = (char === ' ') ? this.wordSpacing : (index < arr.length - 1 ? this.letterSpacing : 0);
      return sum + charWidth + extraSpace;
    }, 0);
  }

  calculateSidePadding(width: number): number {
    let totalWidth = 50; // Tyütyü teljes szélessége cm-ben
    return (totalWidth - width) / 2; // Oldalsó térköz számítása
  }
}
