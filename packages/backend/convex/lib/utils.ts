/**
 * asyncMapWithIndex returns the results of applying an async function over an list.
 *
 * @param list - Iterable object of items, e.g. an Array, Set, Object.keys
 * @param asyncTransform
 * @returns
 */
export async function asyncMapWithIndex<FromType, ToType>(
  list: Iterable<FromType>,
  asyncTransform: (item: FromType, index: number) => Promise<ToType>
): Promise<ToType[]> {
  const promises: Promise<ToType>[] = [];
  let index = 0;
  for (const item of list) {
    promises.push(asyncTransform(item, index));
    index++;
  }
  return Promise.all(promises);
}

export function capitalizeEachWord(str: string) {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export function createUniqueCombinations(ids: string[]): string[][] {
  const result: string[][] = [];

  // Iterate through the list of IDs
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const combination = [ids[i], ids[j]].sort(); // Sort the IDs to ensure uniqueness
      result.push(combination);
    }
  }

  // Remove duplicate combinations using a Set
  const uniqueCombinations = Array.from(
    new Set(result.map((combination) => combination.join(",")))
  ).map((combinationStr) => combinationStr.split(","));

  return uniqueCombinations;
}

export function getAverageOnArray(arr: number[]) {
  return arr.reduce((a, b) => a + b) / arr.length;
}
