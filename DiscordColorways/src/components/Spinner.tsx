export default function ({ className, children }: { className?: string, children?: React.ReactElement | React.ReactElement[]; }) {
    return <div className={"colorwaysBtn-spinner" + (className ? " " + className : "")} role="img" aria-label="Loading">
        <div className="colorwaysBtn-spinnerInner">
            <svg className="colorwaysBtn-spinnerCircular" viewBox="25 25 50 50" fill="currentColor">
                <circle className="colorwaysBtn-spinnerBeam colorwaysBtn-spinnerBeam3" cx="50" cy="50" r="20" />
                <circle className="colorwaysBtn-spinnerBeam colorwaysBtn-spinnerBeam2" cx="50" cy="50" r="20" />
                <circle className="colorwaysBtn-spinnerBeam" cx="50" cy="50" r="20" />
            </svg>
        </div>
    </div>;
}
