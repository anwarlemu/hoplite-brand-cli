---
name: input-otp
title: Input OTP
type: ui
surface: site
kinds: [input]
description: "A one-time code on Base UI's OTP field: joined square 40px cells on the quiet rule, a 16px Kode Mono character in each, the cell with the caret on the strong edge; orange edges when invalid."
use_for: "Use InputOTP for a short verification or pairing code. Set maxLength and lay out InputOTPSlot cells in one or two InputOTPGroup rows with an InputOTPSeparator between. Digits are the default; pass pattern=REGEXP_ONLY_DIGITS_AND_CHARS for letters too. Label it with a visible label and htmlFor on the id."
never: [Rounded cells, Satoshi or display type in the cells, An orange active cell, Cells that grow when focused]
source: "Extrapolated from the Hoplite website: the joined boxes of its changelog filter (.cl-filter), its quiet and strong lines, and Kode Mono for codes"
---
