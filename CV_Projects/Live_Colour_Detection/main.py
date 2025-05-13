import cv2
import numpy as np
from util import get_limits

color = [0,255,255]  # The target color in BGR
cap = cv2.VideoCapture(0)

MIN_AREA = 100  # Minimum area below which boxes are considered noise
MERGE_DISTANCE = 20  # How close two boxes must be to merge (pixels)


def boxes_are_close_or_overlap(b1, b2, gap=MERGE_DISTANCE):
    """
    Checks if two bounding boxes (x1, y1, w1, h1) and (x2, y2, w2, h2)
    overlap OR are within 'gap' pixels of each other horizontally/vertically.
    Returns True if they should be merged.
    """
    x1, y1, w1, h1 = b1
    x2, y2, w2, h2 = b2

    # Compute the "outer" rectangle that would enclose both
    left = min(x1, x2)
    right = max(x1 + w1, x2 + w2)
    top = min(y1, y2)
    bottom = max(y1 + h1, y2 + h2)

    # Combined width/height
    combined_w = (right - left)
    combined_h = (bottom - top)

    # Sum of the individual widths/heights
    sum_w = w1 + w2
    sum_h = h1 + h2

    # If boxes overlap, the combined_w < sum_w or combined_h < sum_h.
    # But we also want to allow them to be near each other (within gap).

    # Check horizontally if the expanded bounding box is not too large
    # compared to the sum of widths plus allowed gap
    horizontal_ok = (combined_w - sum_w) < gap

    # Check vertically similarly
    vertical_ok = (combined_h - sum_h) < gap

    return horizontal_ok and vertical_ok


def merge_boxes(b1, b2):
    """
    Merges two bounding boxes into a single bounding box that encloses both.
    Each box is (x, y, w, h). Return the merged box (x, y, w, h).
    """
    x1, y1, w1, h1 = b1
    x2, y2, w2, h2 = b2

    left = min(x1, x2)
    right = max(x1 + w1, x2 + w2)
    top = min(y1, y2)
    bottom = max(y1 + h1, y2 + h2)

    return (left, top, right - left, bottom - top)


while True:
    ret, frame = cap.read()
    if not ret:
        break

    hsv_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

    # Get lower and upper HSV limits for your target color
    lowerLim, upperLim = get_limits(color=color)
    mask = cv2.inRange(hsv_frame, lowerLim, upperLim)

    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Collect bounding boxes
    boxes = []
    for cnt in contours:
        x, y, w, h = cv2.boundingRect(cnt)
        # Filter out small or noisy contours
        if w * h >= MIN_AREA:
            boxes.append((x, y, w, h))

    # --- Merge boxes that overlap or are close ---
    merged_boxes = []
    while boxes:
        current = boxes.pop(0)  # Take one box
        # Keep merging with anything that overlaps or is close
        merged_any = True
        while merged_any:
            merged_any = False
            for i, other in enumerate(boxes):
                if boxes_are_close_or_overlap(current, other, MERGE_DISTANCE):
                    # Merge them
                    current = merge_boxes(current, other)
                    # Remove 'other' from list
                    boxes.pop(i)
                    merged_any = True
                    break
        # After no more merges with current, put it to merged list
        merged_boxes.append(current)

    # Draw final merged boxes
    for (x, y, w, h) in merged_boxes:
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 255), 2)

    cv2.imshow('live_cam', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
