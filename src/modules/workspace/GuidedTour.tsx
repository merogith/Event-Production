import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store';

interface Stop {
  title: string;
  body: string;
  /** Where the stop lives, relative to the first demo event. */
  route?: (workspaceId: string, eventId: string) => string;
  eventPrefix?: string;
  action: string;
}

const STOPS: Stop[] = [
  {
    title: 'Advance the show',
    body: 'Start with AURELIA. Confirm a required line under Still missing and watch the readiness figure update. Your changes stay in this browser; Reset restores the fictional demo.',
    eventPrefix: 'AURELIA',
    route: (w, e) => `/w/${w}/events/${e}/advancing`,
    action: 'Confirm a missing item',
  },
  {
    title: 'See the day come together',
    body: 'ATLAS has a complete itinerary. Travel, hotel and production calls appear in one chronological day sheet, derived from the advance. Advance sheet opens the printable version.',
    eventPrefix: 'ATLAS',
    route: (w, e) => `/w/${w}/events/${e}/advancing?tab=daysheet`,
    action: 'Inspect the day sheet',
  },
  {
    title: 'Settle the night',
    body: 'ATLAS has already played. Change a ticket count and see revenue, the deal and the final statement recalculate together. Print the statement to keep a PDF.',
    eventPrefix: 'ATLAS',
    route: (w, e) => `/w/${w}/events/${e}/settlement`,
    action: 'Change a ticket count',
  },
  {
    title: 'Start with the room',
    body: 'Every guest carries a voice, a tier and an audience. Filter the list, then open anyone to see how their media value breaks down.',
    route: (w, e) => `/w/${w}/events/${e}/guests`,
    action: 'Open a guest',
  },
  {
    title: 'Seat the politics',
    body: 'Drag someone into a seat, or select a seat and pick a guest. Rules will warn you about who should not sit near whom, and they never stop you doing it anyway.',
    route: (w, e) => `/w/${w}/events/${e}/seating`,
    action: 'Move someone',
  },
  {
    title: 'Run the show',
    body: 'Change one duration and watch every start time below it re-time. Anchors hold the moments that cannot move.',
    route: (w, e) => `/w/${w}/events/${e}/rundown`,
    action: 'Edit a duration',
  },
  {
    title: 'Work the door',
    body: 'Type a name, and misspell it if you like. Check someone in and it shows up straight away in any other tab, which will then refuse the duplicate.',
    route: (w, e) => `/w/${w}/events/${e}/checkin`,
    action: 'Check someone in',
  },
  {
    title: 'Now make it yours',
    body: 'Studio is where the vocabulary, fields, metric weights and modules live. Rename a voice and it changes everywhere, with no rebuild.',
    route: (w) => `/w/${w}/studio`,
    action: 'Open Studio',
  },
];

/**
 * A five-minute tour of the product's actual argument. Skippable, resumable,
 * never modal: it sits in the corner and the app stays usable behind it.
 */
export function GuidedTour() {
  const navigate = useNavigate();
  const { workspaceId } = useParams();
  const tourStep = useStore((s) => s.tourStep);
  const setTourStep = useStore((s) => s.setTourStep);
  const completeTour = useStore((s) => s.completeTour);
  const events = useStore((s) => s.events);

  const stop = tourStep === null ? null : STOPS[tourStep];
  const workspaceEvents = events.filter((event) => event.workspaceId === workspaceId);
  const eventId = (workspaceEvents.find((event) => stop?.eventPrefix && event.name.startsWith(stop.eventPrefix))
    ?? workspaceEvents[0])?.id;

  useEffect(() => {
    if (!stop?.route || !workspaceId || !eventId) return;
    navigate(stop.route(workspaceId, eventId));
  }, [stop, workspaceId, eventId, navigate]);

  if (!stop) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 w-[min(24rem,calc(100vw-2rem))] rounded-lg border bg-popover p-4 shadow-2xl"
      role="dialog"
      aria-label="Guided tour"
      data-testid="tour"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Step {tourStep! + 1} of {STOPS.length}
          </p>
          <h2 className="mt-0.5 font-display text-lg leading-tight tracking-tight">{stop.title}</h2>
        </div>
        <Button size="icon-sm" variant="ghost" aria-label="End tour" onClick={completeTour}>
          <X className="size-4" />
        </Button>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{stop.body}</p>

      <div className="mt-4 flex items-center gap-2">
        <span className="mr-auto text-xs text-muted-foreground">Try it: {stop.action}</span>
        {tourStep! > 0 && (
          <Button size="sm" variant="ghost" onClick={() => setTourStep(tourStep! - 1)}>
            Back
          </Button>
        )}
        <Button
          size="sm"
          onClick={() => (tourStep! + 1 >= STOPS.length ? completeTour() : setTourStep(tourStep! + 1))}
        >
          {tourStep! + 1 >= STOPS.length ? 'Finish' : 'Next'}
          <ArrowRight className="size-3.5" />
        </Button>
      </div>

      <div className="mt-3 flex gap-1" aria-hidden>
        {STOPS.map((_, index) => (
          <span
            key={index}
            className={`h-0.5 flex-1 rounded-full ${index <= tourStep! ? 'bg-primary' : 'bg-muted'}`}
          />
        ))}
      </div>
    </div>
  );
}
