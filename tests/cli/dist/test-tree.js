"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invertTree = void 0;
/**
      4
    /   \
   2     7
  / \   / \
 1  3  6   9
       4
     /   \
   7      2
  / \    / \
 9  6   3   1
* Definition for a binary tree node.
* @param {TreeNode} root
* @return {TreeNode} inverted tree
* @example
* invertTree({ left: { value: 2, left: { value: 1 }, right: { value: 3 } }, right: { value: 7, left: { value: 6 }, right: { value: 9 } }, value: 4 });
* // { left: { value: 7, left: { value: 9 }, right: { value: 6 } }, right: { value: 2, left: { value: 3 }, right: { value: 1 } }, value: 4 };
* invertTree({ left: { value: 2, left: { value: 1 }, right: { value: 3 } }, right: { value: 7, left: { value: 6 }, right: { value: 9 } }, value: 4 } | {} | {left: {}, right: {}} | {left: {value:1}, right: {value:2}})
* // {"left":{"value":7,"left":{"value":9},"right":{"value":6}},"right":{"value":2,"left":{"value":3},"right":{"value":1}},"value":4} | {} | {"left":{},"right":{}} | {"left":{"value":2},"right":{"value":1}}
*/
var invertTree = function (root) {
    if (!root || !root.left || !root.right)
        return root;
    var left = root.left, right = root.right;
    root.left = right;
    root.right = left;
    (0, exports.invertTree)(root.left);
    (0, exports.invertTree)(root.right);
    return root;
};
exports.invertTree = invertTree;
