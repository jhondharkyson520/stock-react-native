
export function maskValue(value: string): string {
    const numericValue = value.replace(/\D/g, '');
    const floatValue = parseFloat(numericValue) / 100;

    if(isNaN(floatValue)) return '';

    return floatValue.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })
}
