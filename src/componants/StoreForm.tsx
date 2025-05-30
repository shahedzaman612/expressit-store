// src/components/StoreForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";
import {
  ChatBubbleLeftEllipsisIcon,
  LinkIcon,
  MapPinIcon,
  TagIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

type DomainStatus = "idle" | "checking" | "available" | "taken";

export default function StoreForm() {
  const router = useRouter();
  const [storeName, setStoreName] = useState("");
  const [domain, setDomain] = useState("");
  const [email, setEmail] = useState(""); // Removed default to allow empty state for validation
  const [category, setCategory] = useState("Fashion");
  const [location, setLocation] = useState("Bangladesh");
  const [currency, setCurrency] = useState("BDT");

  // States for validation errors
  const [storeNameError, setStoreNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  // Domain validation states
  const [domainStatus, setDomainStatus] = useState<DomainStatus>("idle");
  const [domainMessage, setDomainMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const debouncedDomain = useDebounce(domain, 500);

  // --- Validation Functions ---
  const validateStoreName = (name: string): boolean => {
    if (name.trim().length > 0 && name.trim().length < 3) {
      setStoreNameError("Store name must be at least 3 characters long");
      return false;
    }
    setStoreNameError("");
    return true;
  };

  const validateEmail = (emailValue: string): boolean => {
    if (emailValue.trim().length === 0) {
      // Let required attribute handle empty, or set specific message if needed on blur
      setEmailError("");
      return true; // Or false if you want to force an error on empty even before submit
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      setEmailError("Invalid email format!");
      return false;
    }
    setEmailError("");
    return true;
  };

  // --- Event Handlers with Validation ---
  const handleStoreNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setStoreName(newName);
    if (newName.trim().length > 0) {
      // Only validate if there's some input
      validateStoreName(newName);
    } else {
      setStoreNameError(""); // Clear error if field is emptied
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail.trim().length > 0) {
      // Only validate if there's some input
      validateEmail(newEmail);
    } else {
      setEmailError(""); // Clear error if field is emptied
    }
  };

  const handleEmailBlur = () => {
    if (email.trim().length === 0) {
      // You could set an error here if you want to show "required" on blur
      // For now, matching the image, it seems errors appear on invalid input or submit
    } else {
      validateEmail(email);
    }
  };

  useEffect(() => {
    if (!debouncedDomain.trim()) {
      setDomainStatus("idle");
      setDomainMessage("");
      return;
    }
    const checkDomain = async () => {
      setDomainStatus("checking");
      setDomainMessage("Checking..."); // Show checking message
      try {
        const response = await fetch(
          `https://interview-task-green.vercel.app/task/domains/check/${debouncedDomain}.expressitbd.com`
        );
        const data = await response.json();
        if (data.taken) {
          setDomainStatus("taken");
          setDomainMessage("Not Available Domain. Re-enter!");
        } else {
          setDomainStatus("available");
          setDomainMessage("Domain is available!");
        }
      } catch (error) {
        setDomainStatus("taken");
        setDomainMessage("Error checking domain. Please try again.");
        console.error("Domain check failed:", error);
      }
    };
    checkDomain();
  }, [debouncedDomain]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Run all validations before submitting
    const isStoreNameValid = validateStoreName(storeName);
    const isEmailValid = validateEmail(email);
    const isDomainReady =
      domainStatus === "available" && debouncedDomain.trim().length > 0;

    if (
      !isDomainReady &&
      debouncedDomain.trim().length > 0 &&
      domainStatus !== "checking"
    ) {
      // If domain has been typed but is not available (and not currently checking)
      // The domainMessage should already be showing "Not Available..."
    } else if (!isDomainReady && debouncedDomain.trim().length === 0) {
      setDomainStatus("taken"); // Consider empty domain as an issue for submission
      setDomainMessage("Domain cannot be empty.");
    }

    if (!isStoreNameValid || !isEmailValid || !isDomainReady) {
      // If store name or email is empty and required, the browser's default validation will also trigger
      // Focus on the first invalid field maybe (optional)
      return;
    }

    setIsSubmitting(true);
    const storeData = {
      name: storeName,
      currency: currency,
      country: location,
      domain: debouncedDomain, // Use debouncedDomain for submission
      category: category,
      email: email,
    };
    try {
      const response = await fetch(
        "https://interview-task-green.vercel.app/task/stores/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(storeData),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create store.");
      }
      alert("Store created successfully! Redirecting...");
      router.push("/Products");
    } catch (error) {
      console.error("Store creation failed:", error);
      alert(
        `Error: ${
          error instanceof Error ? error.message : "An unknown error occurred"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Input Styling Classes ---
  const getInputClass = (error?: string, success?: boolean) => {
    const Suffix = "block w-full rounded-md shadow-sm sm:text-sm p-2.5 ";
    if (error)
      return (
        Suffix + "border-red-500 border focus:border-red-500 focus:ring-red-500"
      );
    if (success)
      return (
        Suffix +
        "border-green-500 border focus:border-green-500 focus:ring-green-500"
      );
    return (
      Suffix +
      "border-gray-300 border focus:border-indigo-500 focus:ring-indigo-500"
    );
  };

  const getDomainInputBorderClass = () => {
    // This will apply to the container div of the domain input
    if (domainStatus === "taken")
      return "border-red-500 focus-within:border-red-500 focus-within:ring-red-500";
    if (domainStatus === "available")
      return "border-green-500 focus-within:border-green-500 focus-within:ring-green-500";
    return "border-gray-300 focus-within:border-indigo-500 focus-within:ring-indigo-500";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {" "}
      {/* noValidate to handle custom validation display */}
      {/* Store Name Input */}
      <div className="flex items-start justify-between space-x-6">
        <div className="w-2/5">
          <div className="flex items-start space-x-3">
            <ChatBubbleLeftEllipsisIcon className="h-6 w-6 text-indigo-600 mt-0.5 flex-shrink-0" />
            <div>
              <label
                htmlFor="storeName"
                className="block text-sm font-semibold text-gray-800"
              >
                Give your online store a name
              </label>
              <p className="mt-1 text-xs text-gray-500">
                A great store name is a big part of your success. Make sure it
                aligns with your brand and products.
              </p>
            </div>
          </div>
        </div>
        <div className="w-3/5">
          <input
            type="text"
            id="storeName"
            value={storeName}
            onChange={handleStoreNameChange} // Use new handler
            onBlur={() => validateStoreName(storeName)} // Validate on blur too
            placeholder="How'd you like to call your store?"
            className={getInputClass(storeNameError)}
            required
            minLength={3} // HTML5 validation as fallback
          />
          {storeNameError && (
            <p className="mt-1 text-xs text-red-600">{storeNameError}</p>
          )}
        </div>
      </div>
      {/* Domain Input */}
      <div className="flex items-start justify-between space-x-6">
        <div className="w-2/5">
          <div className="flex items-start space-x-3">
            <LinkIcon className="h-6 w-6 text-indigo-600 mt-0.5 flex-shrink-0" />
            <div>
              <label
                htmlFor="domain"
                className="block text-sm font-semibold text-gray-800"
              >
                Your online store subdomain
              </label>
              <p className="mt-1 text-xs text-gray-500">
                A SEO-friendly store name is a crucial part of your success.
                Make sure it aligns with your brand and products.
              </p>
            </div>
          </div>
        </div>
        <div className="w-3/5">
          <div
            className={`flex items-center rounded-md shadow-sm border focus-within:ring-1 ${getDomainInputBorderClass()}`}
          >
            <input
              type="text"
              id="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)} // Domain API handles validation feedback
              placeholder="enter your domain name"
              className="block w-full rounded-l-md border-0 p-2.5 text-gray-900 ring-0 focus:ring-0 sm:text-sm flex-grow"
              required
            />
            <span className="inline-flex items-center rounded-r-md border-0 bg-gray-100 px-3 py-2.5 text-sm text-gray-500">
              .expressitbd.com
            </span>
          </div>
          {domainMessage &&
            (domainStatus === "taken" ||
              domainStatus === "available" ||
              domainStatus === "checking" ||
              (domainStatus === "idle" && domain.length > 0)) && (
              <p
                className={`mt-1 text-xs ${
                  domainStatus === "taken" ||
                  (domainStatus === "idle" && domainMessage)
                    ? "text-red-600"
                    : domainStatus === "available"
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                {domainMessage}
              </p>
            )}
        </div>
      </div>
      {/* Where's your store located? (No specific validation shown in image) */}
      <div className="flex items-start justify-between space-x-6">
        <div className="w-2/5">
          <div className="flex items-start space-x-3">
            <MapPinIcon className="h-6 w-6 text-indigo-600 mt-0.5 flex-shrink-0" />
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-semibold text-gray-800"
              >
                Where's your store located?
              </label>
              <p className="mt-1 text-xs text-gray-500">
                Set your store's default location so we can optimize store
                access and speed for your customers.
              </p>
            </div>
          </div>
        </div>
        <div className="w-3/5">
          <select
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={getInputClass()} // Default styling
          >
            <option>Bangladesh</option>
          </select>
        </div>
      </div>
      {/* What's your Category? (No specific validation shown in image) */}
      <div className="flex items-start justify-between space-x-6">
        <div className="w-2/5">
          <div className="flex items-start space-x-3">
            <TagIcon className="h-6 w-6 text-indigo-600 mt-0.5 flex-shrink-0" />
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-semibold text-gray-800"
              >
                What's your Category?
              </label>
              <p className="mt-1 text-xs text-gray-500">
                Set your store's default category so that we can optimize store
                access and speed for your customers.
              </p>
            </div>
          </div>
        </div>
        <div className="w-3/5">
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={getInputClass()} // Default styling
          >
            <option>Fashion</option>
            <option>Electronics</option>
            <option>Groceries</option>
          </select>
        </div>
      </div>
      {/* Choose store currency (No specific validation shown in image) */}
      <div className="flex items-start justify-between space-x-6">
        <div className="w-2/5">
          <div className="flex items-start space-x-3">
            <CurrencyDollarIcon className="h-6 w-6 text-indigo-600 mt-0.5 flex-shrink-0" />
            <div>
              <label
                htmlFor="currency"
                className="block text-sm font-semibold text-gray-800"
              >
                Choose store currency
              </label>
              <p className="mt-1 text-xs text-gray-500">
                This is the main currency you wish to sell in.
              </p>
            </div>
          </div>
        </div>
        <div className="w-3/5">
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className={getInputClass()} // Default styling
          >
            <option value="BDT">BDT (Taka)</option>
          </select>
        </div>
      </div>
      {/* Store contact email */}
      <div className="flex items-start justify-between space-x-6">
        <div className="w-2/5">
          <div className="flex items-start space-x-3">
            <EnvelopeIcon className="h-6 w-6 text-indigo-600 mt-0.5 flex-shrink-0" />
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-800"
              >
                Store contact email
              </label>
              <p className="mt-1 text-xs text-gray-500">
                This is the email you'll use to send notifications to and
                receive orders from customers.
              </p>
            </div>
          </div>
        </div>
        <div className="w-3/5">
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange} // Use new handler
            onBlur={handleEmailBlur} // Validate on blur
            placeholder="you@example.com"
            className={getInputClass(emailError)}
            required
          />
          {emailError && (
            <p className="mt-1 text-xs text-red-600">{emailError}</p>
          )}
        </div>
      </div>
      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSubmitting || domainStatus === "checking"} // Also disable if domain is being checked
          className="rounded-md bg-indigo-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create store"}
        </button>
      </div>
    </form>
  );
}
