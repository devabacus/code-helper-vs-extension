/**
 * A configuration object that defines a single section to be replaced.
 */
export interface SectionConfig {
  startMarker: string;
  endMarker: string;
  newContent: string; // The actual content to be inserted.
}
/**
 * A universal tool to replace content within marked sections of a string.
 */
export class SectionReplacer {
  /**
   * Processes a string, replacing all configured sections.
   * @param content The initial content string.
   * @param sections An array of section configurations.
   * @returns The content string with all sections replaced.
   */
  public process(content: string, sections: SectionConfig[]): string {
    let newContent = content;
    for (const section of sections) {
      newContent = this.replaceSection(
        newContent,
        section.startMarker,
        section.endMarker,
        section.newContent
      );
    }
    return newContent;
  }

  /**
   * Replaces a single section defined by start and end markers.
   * This is the exact same logic from your PatternBasedProcessor.
   */
  private replaceSection(
    content: string,
    startMarker: string,
    endMarker: string,
    newContent: string
  ): string {
    const regex = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`, 'g');
    const replacement = `${startMarker}\n  ${newContent}\n  ${endMarker}`;
    return content.replace(regex, replacement);
  }
}