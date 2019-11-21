//
// Visual Studio TestResult format:
//
//public sealed class TestResult : TestObject
//{
//	public TestCase TestCase { get; }
//	public Collection<AttachmentSet> Attachments { get; }
//	public TestOutcome Outcome { get; set; }
//	public string ErrorMessage { get; set; }
//	public string ErrorStackTrace { get; set; }
//	public string DisplayName { get; set; }
//	public Collection<TestResultMessage> Messages { get; }
//	public string ComputerName { get; set; }
//	public TimeSpan Duration { get; set; }
//	public DateTimeOffset StartTime { get; set; }
//	public DateTimeOffset EndTime { get; set; }
//	public override IEnumerable<TestProperty> Properties { get; }
//}

export class VsTestResult {
	public testFilename: string = '';
	public fqName: string = '';
	public displayName: string = '';
	public testOutcome: VsTestResult.TestOutcome = VsTestResult.TestOutcome.Failed;
	public errorMessage: string = '';
	public errorStackTrace: string = '';
	public startTime!: Date;
	public endTime!: Date;
	public durationMs: number = 0;

	public saveErrorInfo(ex: Error) {
		this.testOutcome = VsTestResult.TestOutcome.Failed;
		this.errorMessage = ex.message;
		this.errorStackTrace = ex.stack ?? new Error().stack ?? 'No stack trace available';
		//this.errorName = ex.name;
	}
}

// VS test outcome enum (merged export)
export namespace VsTestResult {
	export enum TestOutcome {
		None = 0,
		Passed,
		Failed,
		Skipped,
		NotFound
	}
}
