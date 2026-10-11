import { expect, test } from "bun:test";
import { lesson as compoundLesson } from "../../../content/src/compound-interest/index";
import { lesson as loanLesson } from "../../../content/src/loan-payments/index";
import { lesson as tipLesson } from "../../../content/src/tip-splitting/index";
import { en } from "../../../i18n/src/en";
import { messages as compoundMessages } from "../../../i18n/src/topics/compound-interest";
import { messages as loanMessages } from "../../../i18n/src/topics/loan-payments";
import { messages as tipMessages } from "../../../i18n/src/topics/tip-splitting";
import { ui } from "../../../i18n/src/ui";
import { evaluateDrafts } from "../evaluate";
import { adapter as compoundAdapter } from "./compound-interest/adapter";
import { presentExample as presentCompoundExample } from "./compound-interest/examples";
import { adapter as loanAdapter } from "./loan-payments/adapter";
import { presentExample as presentLoanExample } from "./loan-payments/examples";
import { adapter as tipAdapter } from "./tip-splitting/adapter";
import { presentExample as presentTipExample } from "./tip-splitting/examples";

const compoundMsgs = { ...en, ...ui, ...compoundMessages };
const loanMsgs = { ...en, ...ui, ...loanMessages };
const tipMsgs = { ...en, ...ui, ...tipMessages };

test("compound-interest adapter, calculation, and all lesson examples produce expected presenter results", () => {
  const exampleBlocks = compoundLesson.blocks.filter(
    (b) => b.kind === "example",
  );
  expect(exampleBlocks.length).toBe(3);

  for (const block of exampleBlocks) {
    if (block.kind !== "example") continue;
    const presentation = presentCompoundExample(
      { operation: block.operation, inputs: block.inputs },
      "en-US",
      compoundMsgs,
    );

    expect(presentation.ok).toBe(true);
    if (!presentation.ok) continue;

    expect(presentation.fields.length).toBe(4);
    expect(presentation.working.length).toBeGreaterThan(0);
    expect(presentation.answer).toBeDefined();
  }

  // Independent reference fixture 1: $1,000.00, 10%, 2 years, annual -> $1,210.00
  const calculation = compoundAdapter.calculate("compound", {
    principal: "1000.00",
    annualRate: "10",
    years: "2",
    frequency: "1",
  });
  expect(calculation.ok).toBe(true);
  if (calculation.ok) {
    expect(calculation.result.answer.cents).toBe("121000");
    expect(calculation.result.interestCents).toBe("21000");
    expect(calculation.result.annualSeries.length).toBe(2);
    expect(calculation.result.annualSeries[1]?.balanceCents).toBe("121000");
  }
});

test("loan-payments adapter, calculation, and all lesson examples produce expected presenter results", () => {
  const exampleBlocks = loanLesson.blocks.filter((b) => b.kind === "example");
  expect(exampleBlocks.length).toBe(3);

  for (const block of exampleBlocks) {
    if (block.kind !== "example") continue;
    const presentation = presentLoanExample(
      { operation: block.operation, inputs: block.inputs },
      "en-US",
      loanMsgs,
    );

    expect(presentation.ok).toBe(true);
    if (!presentation.ok) continue;

    expect(presentation.fields.length).toBe(3);
    expect(presentation.working.length).toBeGreaterThan(0);
    expect(presentation.answer).toBeDefined();
  }

  // Independent reference fixture: $10.00, 0%, 3 months -> $3.33, $3.33, $3.34; $10.00 total
  const zeroRateCalc = loanAdapter.calculate("amortize", {
    principal: "10.00",
    annualRate: "0",
    months: "3",
  });
  expect(zeroRateCalc.ok).toBe(true);
  if (zeroRateCalc.ok) {
    expect(zeroRateCalc.result.regularPaymentCents).toBe("333");
    expect(zeroRateCalc.result.finalPaymentCents).toBe("334");
    expect(zeroRateCalc.result.answer.cents).toBe("1000");
    expect(zeroRateCalc.result.totalInterestCents).toBe("0");
    expect(zeroRateCalc.result.schedule.length).toBe(3);
    expect(zeroRateCalc.result.schedule[0]?.paymentCents).toBe("333");
    expect(zeroRateCalc.result.schedule[1]?.paymentCents).toBe("333");
    expect(zeroRateCalc.result.schedule[2]?.paymentCents).toBe("334");
  }
});

test("tip-splitting adapter, calculation, and all lesson examples produce expected presenter results", () => {
  const exampleBlocks = tipLesson.blocks.filter((b) => b.kind === "example");
  expect(exampleBlocks.length).toBe(3);

  for (const block of exampleBlocks) {
    if (block.kind !== "example") continue;
    const presentation = presentTipExample(
      { operation: block.operation, inputs: block.inputs },
      "en-US",
      tipMsgs,
    );

    expect(presentation.ok).toBe(true);
    if (!presentation.ok) continue;

    expect(presentation.fields.length).toBe(3);
    expect(presentation.working.length).toBeGreaterThan(0);
    expect(presentation.answer).toBeDefined();
  }

  // Independent reference fixture: $10.00, 15%, 3 people -> $1.50 tip, $11.50 total; one $3.84, two $3.83
  const tipCalc = tipAdapter.calculate("split", {
    subtotal: "10.00",
    tipRate: "15",
    people: "3",
  });
  expect(tipCalc.ok).toBe(true);
  if (tipCalc.ok) {
    expect(tipCalc.result.tipCents).toBe("150");
    expect(tipCalc.result.totalCents).toBe("1150");
    const [baseShare, extraShare] = tipCalc.result.shares;
    expect(baseShare.shareCents).toBe("383");
    expect(baseShare.count).toBe(2);
    expect(extraShare.shareCents).toBe("384");
    expect(extraShare.count).toBe(1);

    // Sum invariant check: 383 * 2 + 384 * 1 = 766 + 384 = 1150
    const sumCents =
      BigInt(baseShare.shareCents) * BigInt(baseShare.count) +
      BigInt(extraShare.shareCents) * BigInt(extraShare.count);
    expect(sumCents).toBe(BigInt(tipCalc.result.totalCents));
  }
});

test("draft evaluation correctly handles incomplete and invalid inputs across financial adapters", () => {
  // Compound incomplete years
  const compIncomplete = evaluateDrafts({
    operationId: "compound",
    fields: compoundAdapter.descriptors[0]?.fields ?? [],
    drafts: {
      principal: "1000.00",
      annualRate: "5",
      years: "",
      frequency: "12",
    },
    locale: "en-US",
    parseField: compoundAdapter.parseField,
    calculate: (fields) => compoundAdapter.calculate("compound", fields),
  });
  expect(compIncomplete.status).toBe("incomplete");

  // Loan negative rate error from engine
  const loanInvalid = loanAdapter.calculate("amortize", {
    principal: "1000.00",
    annualRate: "-5",
    months: "12",
  });
  expect(loanInvalid.ok).toBe(false);

  // Tip negative people invalid field
  const tipInvalidField = tipAdapter.parseField("abc", "en-US", {
    id: "people",
    labelKey: "tip-splitting.field.people",
    defaultValue: "2",
    input: "integer",
  });
  expect(tipInvalidField.state).toBe("invalid");
});

test("content and message evidence for formula and source corrections", () => {
  expect(tipMsgs["lesson.tip-splitting.formula.split"]).toContain(
    "cents(G) = q × N + r",
  );
  expect(tipMsgs["lesson.tip-splitting.allocation.body"]).toContain(
    "quotient q",
  );
  expect(tipMsgs["lesson.tip-splitting.allocation.body"]).toContain(
    "remainder r",
  );
  expect(loanMsgs["lesson.loan-payments.sources.body"]).toContain(
    "https://www.consumerfinance.gov/ask-cfpb/what-is-amortization-and-how-could-it-affect-my-auto-loan-en-771/",
  );
  expect(loanMsgs["lesson.loan-payments.sources.body"]).toContain(
    "it is not the source of the annuity equation above",
  );
  expect(loanMsgs["lesson.loan-payments.sources.body"]).toContain(
    "M = P × i / (1 − (1 + i)^−N)",
  );
  expect(loanMsgs["lesson.loan-payments.sources.body"]).toContain(
    "Consumer Financial Protection Bureau (CFPB)",
  );
});
