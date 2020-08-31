import { Node } from '../../src/decision-tree/Node';

describe('Given a new Node instance', () => {
  let root: Node<string>;

  beforeEach(() => {
    root = new Node<string>('root');
  });

  describe('Then the node has the correct initial properties', () => {
    it('With the passed value', () => {
      expect(root.value).toBe('root');
    });
    it('And no children', () => {
      expect(root).toHaveLength(0);
    });
    it('And no edges', () => {
      expect(root.edges).toHaveLength(0);
    });
  });

  describe('When I add a child with an edge label', () => {
    let child: Node<string>;
    let result: Node<string>;

    const label = 'some edge label';

    beforeEach(() => {
      child = new Node<string>('child');
      result = root.addChild(label, child);
    });

    it('Then the node being added to is returned', () => {
      expect(result).toEqual(root);
    });

    describe('Then the node added to has the correct properties', () => {
      it('With the same value', () => {
        expect(root.value).toBe('root');
      });
      it('And one child', () => {
        expect(root).toHaveLength(1);
      });
      it('And one edge with the correct value', () => {
        expect(root.edges).toEqual([label]);
      });
    });

    // describe('When I then get the ')
    // TODO then get a child
  });
});
