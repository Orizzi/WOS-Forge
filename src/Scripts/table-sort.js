/**
 * ====== TABLE SORTING MODULE ======
 *
 * Makes the results table headers clickable to sort
 * Click a header to sort by that column (ascending)
 * Click again to reverse the sort order (descending)
 *
 * Keyboard accessible: Tab to header, Enter/Space to sort
 */

const TableSortModule = (function(){

  /**
   * makeTableSortable(table)
   * Makes a table sortable by clicking on headers
   * @param {HTMLElement} table - The table element to make sortable
   */
  function makeTableSortable(table){
    if(!table) return;

    // Find all <th> elements with data-key attribute
    const ths = table.querySelectorAll('thead th[data-key]');
    if(!ths || !ths.length) return;

    // Determine column indices dynamically from header positions

    // Make each header clickable and keyboard accessible
    ths.forEach(th => {
      th.style.cursor = 'pointer';           // Show pointer cursor
      th.setAttribute('role','button');      // Tell screen readers it's a button
      th.setAttribute('tabindex','0');       // Make it focusable with Tab key
      th.addEventListener('click', () => sortBy(th));  // Sort on click
      th.addEventListener('keydown', (e) => {
        // Allow Enter or Space to sort
        if(e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          sortBy(th);
        }
      });
    });

    /**
     * sortBy(th)
     * Sorts table rows by the clicked header
     * @param {HTMLElement} th - The header that was clicked
     */
    function sortBy(th){
      // Determine index from header position for generic tables
      const idx = Array.prototype.indexOf.call(th.parentNode.children, th);
      const tbody = table.tBodies[0];  // Get the table body
      if(!tbody) return;

      // Get all rows as an array so we can sort them
      const rows = Array.from(tbody.querySelectorAll('tr'));

      // Toggle between ascending (asc) and descending (desc)
      const dir = th.dataset.sortDir === 'asc' ? 'desc' : 'asc';

      // Clear sorting indicators from all other headers
      ths.forEach(h => {
        delete h.dataset.sortDir;  // Remove sort direction
        h.classList.remove('sorted-asc','sorted-desc');  // Remove visual indicators
        h.setAttribute('aria-sort','none');  // Tell screen readers
      });

      // Mark this header as sorted
      th.dataset.sortDir = dir;
      th.classList.add(dir === 'asc' ? 'sorted-asc' : 'sorted-desc');
      th.setAttribute('aria-sort', dir === 'asc' ? 'ascending' : 'descending');

      /**
       * parseCell(row)
       * Extracts the value from a cell and converts it to a sortable format
       * - If it's a number, returns the number (for numeric sort)
       * - If it's text, returns lowercase text (for alphabetic sort)
       * - Removes commas from numbers (e.g., "1,000" → 1000)
       */
      const parseCell = (row) => {
        const cell = row.children[idx];
        if(!cell) return '';

        let t = cell.textContent.trim();
        t = t.replace(/,/g,'');

        // Support compact suffixes like 9.5K, 3.2M, 1.1B
        const suffixMatch = t.match(/^(-?\d+(?:\.\d+)?)([KMB])$/i);
        if (suffixMatch) {
          const num = parseFloat(suffixMatch[1]);
          const suf = suffixMatch[2].toUpperCase();
          const mult = suf === 'K' ? 1e3 : suf === 'M' ? 1e6 : 1e9;
          return num * mult;
        }

        const v = parseFloat(t);
        return isNaN(v) ? t.toLowerCase() : v;
      };

      // Sort the rows
      rows.sort((a,b) => {
        const va = parseCell(a);  // Get sortable value from row a
        const vb = parseCell(b);  // Get sortable value from row b

        // Numeric sort (if both are numbers)
        if(typeof va === 'number' && typeof vb === 'number')
          return dir === 'asc' ? va - vb : vb - va;

        // Text sort (alphabetic)
        if(va < vb) return dir === 'asc' ? -1 : 1;
        if(va > vb) return dir === 'asc' ? 1 : -1;
        return 0;
      });

      // Re-append rows in sorted order
      rows.forEach(r => tbody.appendChild(r));
    }
  }

  // Public API
  return {
    makeTableSortable
  };
})();
