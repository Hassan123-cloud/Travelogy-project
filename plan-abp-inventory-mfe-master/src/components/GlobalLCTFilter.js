import React from 'react';
import { GlobalFilterDialog } from "@jda/list-view-container"

export const GlobalLCTFilter = ({ onClose, onApply }) => <GlobalFilterDialog onCloseDialog={onClose} onApply={onApply} apiHost={''} />;

export default GlobalLCTFilter;