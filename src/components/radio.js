(() => ({
  name: 'RadioGroup',
  type: 'CONTENT_COMPONENT',
  allowedTypes: [],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    const {
      label,
      required,
      disabled,
      defaultValue,
      row,
      helperText,
      radioOptions,
      model,
      optionType,
      labelProp,
      valueProp,
      actionInputId,
      size,
      position,
      margin,
      error,
      filter,
      property,
      propertyLabelOverride,
      fullWidth,
      showError,
      hideLabel,
    } = options;
    const isDev = B.env === 'dev';
    const displayError = showError === 'built-in';

    const { useGetAll, getProperty, useText, getActionInput,GetOneProvider, Query, env, getModel } = B;
    const {gql} = window;

    const { label: propertyLabelText } = getProperty(property) || {};
    const propLabelOverride = useText(propertyLabelOverride);
    const propertyLabel = propLabelOverride || propertyLabelText;
    const labelText = property ? propertyLabel : useText(label);

    const labelProperty = getProperty(labelProp);
    const valueProperty = getProperty(valueProp);
    const actionInput = getActionInput(actionInputId);

    let componentValue = useText(defaultValue);
    const componentHelperText = useText(helperText);

    componentValue = isNaN(Number(componentValue))
      ? componentValue
      : Number(componentValue);

    // maintain the type of the value
    const getValue = val => (isNaN(Number(val)) ? val : Number(val));
    const [value, setValue] = useState(getValue(componentValue));

    const {
      FormControl: MUIFormControl,
      RadioGroup,
      FormControlLabel: MUIFormControlLabel,
      FormHelperText,
      FormLabel,
      Radio,
    } = window.MaterialUI.Core;

    


    // const { loading, error: err, data, refetch } =
    //   model && useGetAll(model, { filter, skip: 0, take: 50 });


    const mounted = useRef(true);
    // useEffect(() => {
    //   if (!mounted.current && loading) {
    //     B.triggerEvent('onLoad', loading);
    //   }
    //   mounted.current = false;
    // }, [loading]);

    // if (err && !displayError) {
    //   B.triggerEvent('onError', err.message);
    // }

    // const { results } = data || {};
    // if (results) {
    //   if (results.length > 0) {
    //     B.triggerEvent('onSuccess', results);
    //   } else {
    //     B.triggerEvent('onNoResults');
    //   }
    // }

    // useEffect(() => {
    //   B.defineFunction('Refetch', () => refetch());
    // }, [refetch]);

    // renders the radio component
    const renderRadio = (optionValue, optionLabel) => (
      <MUIFormControlLabel
        disabled={disabled}
        value={optionValue}
        control={<Radio tabIndex={isDev && -1} size={size} />}
        label={optionLabel}
        labelPlacement={position}
      />
    );
    const radioData = (radioOptions || '').split('\n');

    const renderRadios = (results) => {
      if (optionType !== 'data') {
        return radioData.map(option => renderRadio(option, option));
      }
      if (isDev) return renderRadio('value', 'Placeholder');
      // if (loading) return <span>Loading...</span>;
      // if (err && displayError) return <span>{err.message}</span>;
      return results.map(item =>
        renderRadio(item[valueProperty.name], item[labelProperty.name]),
      );
    };

    const handleChange = evt => {
      setValue(getValue(evt.target.value));
    };

    useEffect(() => {
      if (isDev) {
        setValue(useText(defaultValue));
      }
    }, [isDev, defaultValue]);

    const FormControl = ({results}) => {
      return(
      <MUIFormControl
        classes={{ root: classes.formControl }}
        required={required}
        margin={margin}
        component="fieldset"
        error={error}
        fullWidth={fullWidth}
      >
        {!hideLabel && <FormLabel component="legend">{labelText}</FormLabel>}
        <RadioGroup
          row={row}
          value={value}
          // name={actionInput && actionInput.name}
          onChange={handleChange}
          aria-label={labelText}
        >
          {renderRadios(results)}
        </RadioGroup>
        <input type="hidden" name={actionInput && actionInput.name} value={value}></input>
        <FormHelperText>{componentHelperText}</FormHelperText>
      </MUIFormControl>)
    };

    const queryKey = "allQuestionnairequestionoption"; //all<modelnaam> or one<modelnaam>
    const select = "results{id,title}"; //properties
    const q = "query ($skip: Int, $take: Int) {\
      " + queryKey + "(skip: $skip, where: $where) {\
        " + select + " \
      }\
    }";

    const g = gql(q);
    const where = B.useFilter(filter);

    if(isDev) {
      return <div><FormControl results={[]} /></div>;
    }

    return(
      <div>
        <Query query={g} variables={{where: where}}>
          {({data, loading, error}) => {
            if(loading || error) {
              return <div>LOADING</div>
            }
            console.log(data); //See how your data looks like.
            const {results} = data.allQuestionnairequestionoption;
            return <div><FormControl results={results} /></div>;
          }}
        </Query>
      </div>
    );

    return isDev ? (
      <div className={classes.root}>{FormControl}</div>
    ) : (
      FormControl
    );
  })(),
  styles: B => t => {
    const style = new B.Styling(t);
    const { color: colorFunc } = B;
    const getOpacColor = (col, val) => colorFunc.alpha(col, val);
    return {
      root: {
        display: ({ options: { fullWidth } }) =>
          fullWidth ? 'block' : 'inline-block',
        '& > *': {
          pointerEvents: 'none',
        },
      },
      formControl: {
        '& > legend': {
          color: ({ options: { labelColor } }) => [
            style.getColor(labelColor),
            '!important',
          ],
          '&.Mui-error': {
            color: ({ options: { errorColor } }) => [
              style.getColor(errorColor),
              '!important',
            ],
          },
          '&.Mui-disabled': {
            pointerEvents: 'none',
            opacity: '0.7',
          },
        },
        '& > p': {
          color: ({ options: { helperColor } }) => [
            style.getColor(helperColor),
            '!important',
          ],
          '&.Mui-error': {
            color: ({ options: { errorColor } }) => [
              style.getColor(errorColor),
              '!important',
            ],
          },
        },
        '& .MuiFormControlLabel-root': {
          '& .MuiRadio-root': {
            color: ({ options: { radioColor } }) => [
              style.getColor(radioColor),
              '!important',
            ],
            '&:hover': {
              backgroundColor: ({ options: { radioColor } }) => [
                getOpacColor(style.getColor(radioColor), 0.04),
                '!important',
              ],
            },
            '&.Mui-checked': {
              color: ({ options: { radioColorChecked } }) => [
                style.getColor(radioColorChecked),
                '!important',
              ],
              '&:hover': {
                backgroundColor: ({ options: { radioColorChecked } }) => [
                  getOpacColor(style.getColor(radioColorChecked), 0.04),
                  '!important',
                ],
              },
            },
          },
          '& .MuiTypography-root': {
            color: ({ options: { textColor } }) => [
              style.getColor(textColor),
              '!important',
            ],
          },
          '&.Mui-disabled': {
            pointerEvents: 'none',
            opacity: '0.7',
          },
        },
      },
    };
  },
}))();
