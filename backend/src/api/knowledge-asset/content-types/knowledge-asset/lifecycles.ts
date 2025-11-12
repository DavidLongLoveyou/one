export default {
  async beforeCreate(event: any) {
    const { data } = event.params;
    
    // Auto-calculate word count and read time
    if (data.content) {
      const textContent = extractTextFromRichtext(data.content);
      const wordCount = textContent.split(/\s+/).filter((word: string) => word.length > 0).length;
      const readTime = Math.ceil(wordCount / 200); // Average reading speed: 200 words/min
      
      data.word_count = wordCount;
      data.read_time = readTime;
    }
    
    // Auto-set published date if not provided
    if (!data.published_date && data.publishedAt) {
      data.published_date = new Date();
    }
  },
  
  async beforeUpdate(event: any) {
    const { data } = event.params;
    
    // Recalculate word count and read time on update
    if (data.content) {
      const textContent = extractTextFromRichtext(data.content);
      const wordCount = textContent.split(/\s+/).filter((word: string) => word.length > 0).length;
      const readTime = Math.ceil(wordCount / 200);
      
      data.word_count = wordCount;
      data.read_time = readTime;
    }
  },
};

function extractTextFromRichtext(content: any): string {
  if (!content) return '';
  
  // Handle string (legacy HTML)
  if (typeof content === 'string') {
    return content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  }
  
  // Handle Strapi richtext structure (array of blocks)
  if (Array.isArray(content)) {
    return content
      .map((block: any) => {
        if (block.type === 'paragraph' && block.children) {
          return block.children
            .map((child: any) => child.text || '')
            .join(' ');
        }
        return '';
      })
      .join(' ')
      .trim();
  }
  
  return '';
}

