
export interface SectionConfig {
  startMarker: string;
  endMarker: string;
  newContent: string; 
}

export class SectionReplacer {
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