import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
interface ItemsProps {
  item: {
    id: number;
    text: string;
  };
}
const Items = ({ item }: ItemsProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    data: {
      type: 'Group',
      item,
    },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  if (isDragging) {
    return <div ref={setNodeRef} style={style} className="drag"></div>;
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="ele"
    >
      <h1 style={{ fontSize: 15 }}>{item?.text}</h1>
    </div>
  );
};

export default Items;
