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

    const label = 'some edge label with CAPITAL letters';

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
      it('And one edge with the correct lowercase value', () => {
        expect(root.edges).toEqual([label.toLowerCase()]);
      });
    });

    it('And duplicate edge labels overwite the existing child', () => {
      const other = new Node<string>('some other thing');
      root.addChild(label, other);
      expect(root).toHaveLength(1);
      expect(root.edges).toEqual([label.toLowerCase()]);
    });

    describe('When I get a child node by its edge label', () => {
      it('Then the correct child node is returned, ignoring case', () => {
        expect(root.getChild(label)).toEqual(child);
      });
      it('And undefined is returned if there is no edge with the passed label', () => {
        expect(root.getChild('the moon')).toBeUndefined();
      });
    });
  });
});
