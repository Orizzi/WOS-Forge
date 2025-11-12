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
    
    // Map column names to column indices (position in table)
    const colMap = { 
      slot: 0,     // Column 0: Charm slot name
      from: 1,     // Column 1: Starting level
      to: 2,       // Column 2: Ending level
      guides: 3,   // Column 3: Guides cost
      designs: 4,  // Column 4: Designs cost
      secrets: 5   // Column 5: Secrets cost
    };

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
      const key = th.dataset.key;  // Get the column name (e.g., 'guides')
      const idx = colMap[key] ?? 0;  // Get the column index
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
        const cell = row.children[idx];  // Get cell at the column index
        if(!cell) return '';
        
        let t = cell.textContent.trim();  // Get text, remove extra spaces
        t = t.replace(/,/g,'');  // Remove commas (e.g., "1,000" → "1000")
        
        const v = parseFloat(t);  // Try to convert to number
        // Return as number if it's numeric, otherwise as lowercase text
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
