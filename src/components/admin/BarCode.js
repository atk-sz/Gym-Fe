import React from 'react';
import { useBarcode } from 'react-barcodes';

const BarCode = ({ card_id }) => {
    const { inputRef } = useBarcode({
        value: card_id
    });

    return <svg ref={inputRef} />;
};

export default BarCode;