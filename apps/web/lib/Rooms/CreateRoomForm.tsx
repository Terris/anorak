import { useMutation } from "convex/react";
import { Field, FieldProps, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { PlusIcon } from "lucide-react";
import { api } from "@repo/backend/convex/_generated/api";
import { useToast } from "@repo/ui/hooks";
import { Button, Input } from "@repo/ui";
import { RoomId } from "./types";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .max(30, "Room name must be less than 30 characters")
    .required("Room name is required"),
});

interface CreateRoomFormValues {
  name: string;
}

export function CreateRoomForm({
  onSuccess,
}: {
  onSuccess?: (newRoomId: RoomId) => void;
}) {
  const { toast } = useToast();
  const createRoom = useMutation(api.rooms.sessionedCreate);

  async function onSubmit(
    values: CreateRoomFormValues,
    actions: FormikHelpers<CreateRoomFormValues>
  ) {
    try {
      const newRoomId = await createRoom({ name: values.name });
      actions.resetForm();
      toast({
        title: "Success!",
        description: "Room created.",
      });
      onSuccess?.(newRoomId);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Something went wrong trying to create room.",
      });
    }
  }

  return (
    <Formik
      initialValues={{
        name: "",
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="flex flex-row items-center justify-between">
            <Field name="name">
              {({ field }: FieldProps) => (
                <Input
                  placeholder="New room name"
                  className="mr-2"
                  {...field}
                />
              )}
            </Field>
            <Button type="submit" disabled={isSubmitting}>
              <PlusIcon className="w-4 h-4" />
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
