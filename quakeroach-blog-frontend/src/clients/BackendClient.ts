export default class BackendClient {
  private readonly api_url: string;
  
  constructor(api_url: string) {
    this.api_url = api_url;
  }

  getMany(maxCount: number, minPublishDate: Date) : Promise<IBlogPostOutput[]> {
    
  }

  get(id: number): Promise<IBlogPostOutput | undefined> {

  }

  create({ title, content } : IBlogPostCreationInput): Promise<number> {
    
  }
}

interface IBlogPostOutput {
  title: string;
  publishDate: Date;
  content: string;
}

interface IBlogPostCreationInput {
  title: string;
  content: string;
}