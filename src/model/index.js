// @flow

export type HashTag = string;

export class Link {
  url: string;
  label: string;
  description: string;
  hashtags: Array<HashTag>;

  constructor(
    url: string,
    label: string,
    description: string,
    hashtags: Array<HashTag>,
  ) {
    this.url = url
    this.label = label
    this.description = description
    this.hashtags = hashtags
  }

  getMergedHashtags(): string {
    return this.hashtags.join('#')
  }
}

/**
  Represents a link, stored in the contract
*/
export class StoredLink extends Link {
  timestamp: number;

  constructor(
    url: string,
    label: string,
    description: string,
    hashtags: Array<HashTag>,
    timestamp: number,
  ) {
    super(url, label, description, hashtags)
    this.timestamp = timestamp
  }
}
