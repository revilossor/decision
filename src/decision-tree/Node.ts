export class Node<T> {
  private children: Map<string, Node<T>>

  public constructor (public value: T) {
    this.children = new Map<string, Node<T>>();
  }

  public addChild (label: string, child: Node<T>): Node<T> {
    this.children.set(label.toLowerCase(), child);
    return this;
  }

  public getChild (label: string):Node<T> | undefined {
    return this.children.get(label.toLowerCase());
  }

  public get length ():number { return this.children.size; }
  public get edges ():string[] { return [...this.children.keys()]; }
}
