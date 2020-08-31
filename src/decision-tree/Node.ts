export class Node {
  public children: Array<Node>

  public constructor (public attribute:string, public value:string) {
    this.children = [];
  }

  public addChild (child: Node): Node {
    this.children.push(child);
    return this;
  }

  public get length ():number { return this.children.length; }
}
