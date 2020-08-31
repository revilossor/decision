import { Node } from '../../src/decision-tree/Node';

describe('Given a new Node instance', () => {
  let root: Node;

  beforeEach(() => {
    root = new Node('root');
  });

  describe('Then the node has the correct initial properties', () => {
    it('With the passed value', () => {
      expect(root.value).toBe('root');
    });
    it('And no children', () => {
      expect(root).toHaveLength(0);
      expect(root.children).toEqual([]);
    });
  });

  describe('When I add a child', () => {
    let child: Node;
    let result: Node;

    beforeEach(() => {
      child = new Node('child');
      result = root.addChild(child);
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
        expect(root.children).toEqual([child]);
      });
    });
  });
});
