import * as React from 'react';
import type {Story} from '@ladle/react';
import {Metafield, type MetafieldProps} from './Metafield.js';
import {getRawMetafield} from './Metafield.test.helpers.js';

const Template: Story<MetafieldProps<React.ElementType>> = (props) => {
  return <Metafield {...props} />;
};

export const SingleLineTextField = Template.bind({});
SingleLineTextField.args = {
  data: getRawMetafield({type: 'single_line_text_field'}),
};

export const MultiLineTextField = Template.bind({});
MultiLineTextField.args = {
  data: getRawMetafield({type: 'multi_line_text_field'}),
};

export const PageReference = Template.bind({});
PageReference.args = {
  data: getRawMetafield({type: 'page_reference'}),
};

export const ProductReference = Template.bind({});
ProductReference.args = {
  data: getRawMetafield({type: 'product_reference'}),
};

export const VariantReference = Template.bind({});
VariantReference.args = {
  data: getRawMetafield({type: 'variant_reference'}),
};

export const FileReference = Template.bind({});
FileReference.args = {
  data: getRawMetafield({type: 'file_reference'}),
};

export const NumberInteger = Template.bind({});
NumberInteger.args = {
  data: getRawMetafield({type: 'number_integer'}),
};

export const NumberDecimal = Template.bind({});
NumberDecimal.args = {
  data: getRawMetafield({type: 'number_decimal'}),
};

export const Dates = Template.bind({});
Dates.args = {
  data: getRawMetafield({type: 'date'}),
};

export const DateTime = Template.bind({});
DateTime.args = {
  data: getRawMetafield({type: 'date_time'}),
};

export const URL = Template.bind({});
URL.args = {
  data: getRawMetafield({type: 'url'}),
};

export const JSON = Template.bind({});
JSON.args = {
  data: getRawMetafield({type: 'json'}),
};

export const Booleans = Template.bind({});
Booleans.args = {
  data: getRawMetafield({type: 'boolean'}),
};

export const Colors = Template.bind({});
Colors.args = {
  data: getRawMetafield({type: 'color'}),
};

export const Weight = Template.bind({});
Weight.args = {
  data: getRawMetafield({type: 'weight'}),
};

export const Volume = Template.bind({});
Volume.args = {
  data: getRawMetafield({type: 'volume'}),
};

export const Dimension = Template.bind({});
Dimension.args = {
  data: getRawMetafield({type: 'dimension'}),
};

export const Rating = Template.bind({});
Rating.args = {
  data: getRawMetafield({type: 'rating'}),
};
