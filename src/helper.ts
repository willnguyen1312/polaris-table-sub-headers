export const getSubHeaderColSpan = (tableContainer: Element) => {
  const tableContainerWidth = tableContainer.getBoundingClientRect().width;
  const tableHead = tableContainer.querySelector("thead");
  const tableHeadCells = (tableHead?.querySelectorAll("th") ??
    []) as NodeListOf<HTMLTableCellElement>;

  let numberOfVisibleColumn = 0;
  let accumulatedCellsWidth = 0;

  for (const cell of tableHeadCells) {
    accumulatedCellsWidth += cell.getBoundingClientRect().width;
    if (accumulatedCellsWidth > tableContainerWidth) {
      break;
    }
    numberOfVisibleColumn++;
  }

  // We need to exclude the first cell because it is the checkbox cell
  // The subheader cell starts spanning from the second cell
  return numberOfVisibleColumn - 1;
};
