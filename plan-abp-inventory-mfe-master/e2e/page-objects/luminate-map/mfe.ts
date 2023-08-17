/*
 * ===============================================================================================================
 *                                Copyright 2021, Blue Yonder Group, Inc.
 *                                           All Rights Reserved
 *
 *                               THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF
 *                                          BLUE YONDER GROUP, INC.
 *
 *
 *                         The copyright notice above does not evidence any actual
 *                                 or intended publication of such source code.
 *
 * ===============================================================================================================
 */
// import { BasePage } from '@by/plat-lui-functional-testing-utils';

export class LuminateMapMfe {
    get $openFilterButton() {
      return $('[data-testid=map-layers-filter-controls-grid-item-additional-filter] button');
    }
    get $layerTab() {
      return $('[data-testid=map-layers-filter-controls-grid-item-filter-button-group] button:nth-child(3)');
    }
    get $checkbox() {
      return $('[aria-label=checkbox-group] div:nth-child(1) input')
    }
    get $radioButton() {
      return $('[data-testid=radio-group] div:nth-child(2) input')
    }
    get $multiselect() {
      return $('[data-testid*=-multiselect]')
    }
    get $multiselectPopup() {
      return $('[role=listbox] li:nth-child(1) input')
    }
    get $applyButton() {
      return $('[aria-label=modal-enabled-apply-button]')
    }
    get $filtersContainer() {
      return $('[aria-label=modal-content]')
    }
    get $filterChip() {
      return $('[id=Filter-Entry-Chip-1] svg')
    }
    get $clearAll() {
      return $('[id=Filter-Clear-All]')
    }
    applyFilter() {
      browser.setTimeout({ 'pageLoad': 100000 })

      this.$layerTab.click()
      this.$openFilterButton.click()
      this.$radioButton.click();
      // this.$multiselect.click();
      // this.$multiselectPopup.click();
      this.$filtersContainer.click();
      this.$applyButton.click();
      this.$filterChip.click();
      this.$filterChip.click();
      this.$clearAll.click();
    }
}
export default new LuminateMapMfe();
