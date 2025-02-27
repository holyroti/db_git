import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { dialogues, DialogueMap, DialogueEntry, NestedTable, SceneNavigation } from '../dialogues';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-visual-novel',
  templateUrl: './visual-novel.component.html',
  styleUrls: ['./visual-novel.component.css'],
  standalone: true,
  imports: [CommonModule]
})

export class VisualNovelComponent {
  currentScene: keyof DialogueMap = 'introduction';
  dialogueIndex: number = 0;
  navigationHistory: { scene: keyof DialogueMap; index: number }[] = []; // Track navigation history

  dialogues: DialogueMap = dialogues;
  currentDialogue: DialogueEntry = this.dialogues[this.currentScene][this.dialogueIndex];

  currentBackground = 'assets/novel/ai/backgrounds/front.webp';
  currentCharacter = 'assets/novel/ai/normalis/normalis-front.png';

  constructor(private sanitizer: DomSanitizer) {}

  currentAchievement: any = null;

  advanceDialogue(next: number | string | SceneNavigation | null = null) {
    console.log('Navigating to:', next); // Debugging log

    // Save current state to history before navigating
    this.navigationHistory.push({ scene: this.currentScene, index: this.dialogueIndex });

    const current = this.dialogues[this.currentScene]?.[this.dialogueIndex];

    if (current?.achievement) {
      this.showAchievementModal(current.achievement);
    }

    if (typeof next === 'number') {
      this.dialogueIndex = next;
    } else if (typeof next === 'string') {
      this.currentScene = next;
      this.dialogueIndex = 0;
    } else if (next && typeof next === 'object' && 'scene' in next && 'index' in next) {
      console.log(`Jumping to Scene: ${next.scene}, Index: ${next.index}`);
      this.currentScene = next.scene;
      this.dialogueIndex = next.index;
    } else if (this.currentDialogue?.next !== undefined) {
      this.advanceDialogue(this.currentDialogue.next);
      return;
    } else {
      console.warn(`End of dialogues in scene: ${this.currentScene}`);
      return;
    }

    this.loadDialogue();
  }

  // New function to go back to the previous dialogue
  previousDialogue() {
    if (this.navigationHistory.length > 0) {
      const lastState = this.navigationHistory.pop();
      if (lastState) {
        this.currentScene = lastState.scene;
        this.dialogueIndex = lastState.index;
        this.loadDialogue();
      }
    } else {
      console.warn('No previous dialogue to return to.');
    }
  }

  loadDialogue() {
    const dialogue = this.dialogues[this.currentScene]?.[this.dialogueIndex];
    if (dialogue) {
      console.log(`Loaded Dialogue: ${dialogue.text}`);
      this.currentDialogue = dialogue;
      this.currentBackground = dialogue.background || "assets/novel/backgrounds/default.png";
      this.currentCharacter = dialogue.character || "assets/novel/characters/default.png";
    } else {
      console.error(`Dialogue not found for: ${this.currentScene} ${this.dialogueIndex}`);
    }
  }

  showAchievementModal(achievement: { title: string; description: string; badgeImage: string }) {
    console.log("Achievement Unlocked:", achievement.title);
  }

  closeAchievementModal() {
    this.currentAchievement = null;
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  isNestedTable(cell: any): cell is NestedTable {
    return cell && Array.isArray(cell.headers) && Array.isArray(cell.rows);
  }
}
