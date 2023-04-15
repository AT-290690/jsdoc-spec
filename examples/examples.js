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
*/
const invertTree = (root) => {
  if (!root || !root.left || !root.right) return root
  const left = root.left,
    right = root.right
  root.left = right
  root.right = left
  ;(0, invertTree)(root.left)
  ;(0, invertTree)(root.right)
  return root
}
/**
 * @param percent number
 * @param value number
 * @returns number
 *
 * @example percent(50, 100)
 * // 52
 * @example percent(12, 100)
 * // 12
 * @example percent(20, 300)
 * // 300 * (20 / 100)
 */
const percent = (percent, value) => Math.round(value * (percent / 100))
/**
 * Sorts an array in descending order
 * @param {*} arr
 * @returns  sorted array
 * @example
 * sortDesc([2,1,8,3])
 * // [1, 2, 3, 8]
 * sortDesc([2,1,8,3])
 * // [8, 3, 2, 1]
 * sortDesc(["a", "b", "c"])
 * // ["c", "b", "a"]
 */
const sortDesc = (arr) => arr.sort((a, b) => (a > b ? -1 : 1))
exports.percent = percent
exports.invertTree = invertTree
exports.sortDesc = sortDesc
