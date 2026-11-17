---
name: field
title: Field
type: ui
surface: site
kinds: [input]
description: "Form layout on Base UI's Field and Fieldset: a 14px medium label 8px above the control, 14px quiet help and 14px orange errors below, fields 24px apart, Chakra Petch 20px set legends, choice cards framed in the quiet rule that turn ink when chosen, and an \"or\" between two quiet rules."
use_for: "Wrap every form control in a Field with a FieldLabel, an optional FieldDescription and a FieldError; group fields in FieldGroup and related choices in FieldSet with a FieldLegend. Use orientation=\"horizontal\" for a check, radio or switch beside its label, FieldContent with FieldTitle and FieldDescription for a setting row, and a FieldLabel wrapping a Field for a choice card. Pass invalid (or data-invalid) to mark the control and show the error."
never: [Errors in any color but the orange, An orange label, Boxed or shaded field groups, Rounded choice cards, Help text above the control]
source: "Extrapolated from the Hoplite website: its 14px type, the quiet and 32 percent lines (--line-quiet, --line-margin), its Chakra Petch group heads (.pr-table) and the principles for fields"
---
