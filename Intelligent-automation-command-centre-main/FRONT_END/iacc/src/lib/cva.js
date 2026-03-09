/**
 * Simple variant helper to replace class-variance-authority
 * This creates a function that returns class names based on variants
 */
export function cva(baseClasses, config = {}) {
    return function(props = {}) {
        const classes = [baseClasses];
        
        if (config.variants) {
            Object.keys(config.variants).forEach(variantKey => {
                const variantValue = props[variantKey];
                if (variantValue && config.variants[variantKey][variantValue]) {
                    classes.push(config.variants[variantKey][variantValue]);
                } else if (config.defaultVariants && config.defaultVariants[variantKey]) {
                    const defaultValue = config.defaultVariants[variantKey];
                    if (config.variants[variantKey][defaultValue]) {
                        classes.push(config.variants[variantKey][defaultValue]);
                    }
                }
            });
        }
        
        if (props.className) {
            classes.push(props.className);
        }
        
        return classes.filter(Boolean).join(' ').trim();
    };
}
